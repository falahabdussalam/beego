import { getProductById } from '../data/catalog.js';
import { query, getMemoryStore } from '../db/client.js';

export const DEFAULT_DELIVERY_FEE = 35.00;
export const FREE_DELIVERY_THRESHOLD = 499.00;
export const DEFAULT_TAX_PERCENT = 5.0;

export const INITIAL_COUPONS = [
  {
    code: 'BEEGO50',
    description: '₹50 Flat OFF on orders above ₹199',
    discountType: 'fixed',
    discountValue: 50.0,
    minOrderAmount: 199.0,
    maxDiscountAmount: 50.0,
    usageLimit: 500,
    timesUsed: 0,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'FIRSTORDER',
    description: '20% OFF on your first Virajpete order',
    discountType: 'percentage',
    discountValue: 20.0,
    minOrderAmount: 149.0,
    maxDiscountAmount: 100.0,
    usageLimit: 1000,
    timesUsed: 0,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'FREESHIP',
    description: 'Free Delivery for orders above ₹299',
    discountType: 'fixed',
    discountValue: 35.0,
    minOrderAmount: 299.0,
    maxDiscountAmount: 35.0,
    usageLimit: 200,
    timesUsed: 0,
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Server-side validated pricing calculation
 * Guarantees zero client-side price or discount manipulation
 */
export async function calculateOrderPricing(cartItems, couponCode = null, distanceKm = 1.0) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart cannot be empty.');
  }

  let subtotal = 0;
  let taxAmount = 0;
  const validatedItems = [];
  let primaryStoreId = null;

  for (const item of cartItems) {
    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error(`Invalid item quantity for product ${item.id}.`);
    }

    // Always fetch latest authoritative product data from database / catalog
    let product = null;
    try {
      const dbRes = await query('SELECT * FROM products WHERE id = $1 AND is_active = true', [item.id]);
      if (dbRes.rows && dbRes.rows.length > 0) {
        const r = dbRes.rows[0];
        product = {
          id: r.id,
          storeId: r.store_id,
          name: r.name,
          price: Number(r.price),
          stock: r.stock,
          isPrescriptionRequired: r.is_prescription_required,
          taxPercent: Number(r.tax_percentage || 5.0),
        };
      }
    } catch (e) {
      // Fallback
    }

    if (!product) {
      const staticProd = await getProductById(item.id);
      if (!staticProd) {
        throw new Error(`Product ${item.id} is no longer available.`);
      }
      product = {
        id: staticProd.id,
        storeId: staticProd.storeId,
        name: staticProd.name,
        price: Number(staticProd.price),
        stock: staticProd.stock ?? 10,
        isPrescriptionRequired: staticProd.isPrescriptionRequired || false,
        taxPercent: 5.0,
      };
    }

    // Single-store enforcement check
    if (!primaryStoreId) {
      primaryStoreId = product.storeId;
    } else if (primaryStoreId !== product.storeId) {
      throw new Error('All items in the cart must be from the same merchant store.');
    }

    // Stock verification
    if (product.stock < qty) {
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
    }

    const itemTotal = Number((product.price * qty).toFixed(2));
    subtotal += itemTotal;

    // Calculate tax for item
    const itemTax = Number(((itemTotal * (product.taxPercent || DEFAULT_TAX_PERCENT)) / 100).toFixed(2));
    taxAmount += itemTax;

    validatedItems.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity: qty,
      totalPrice: itemTotal,
      isPrescriptionRequired: product.isPrescriptionRequired,
    });
  }

  // Delivery fee calculation
  let deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0.00 : DEFAULT_DELIVERY_FEE;

  // Coupon validation
  let discountAmount = 0.00;
  let appliedCouponData = null;

  if (couponCode && couponCode.trim()) {
    const code = couponCode.trim().toUpperCase();
    const couponValidation = await validateCoupon(code, subtotal);
    if (couponValidation.valid) {
      discountAmount = couponValidation.discountAmount;
      appliedCouponData = couponValidation.coupon;
    } else {
      throw new Error(`Invalid promo code: ${couponValidation.reason}`);
    }
  }

  // Final total (cannot be negative)
  const totalAmount = Math.max(0, Number((subtotal + deliveryFee + taxAmount - discountAmount).toFixed(2)));

  return {
    storeId: primaryStoreId,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    totalAmount,
    coupon: appliedCouponData,
    items: validatedItems,
  };
}

/**
 * Coupon validation function
 */
export async function validateCoupon(code, subtotal) {
  const cleanCode = code.trim().toUpperCase();

  // Try DB query
  let coupon = null;
  try {
    const res = await query(
      'SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = true',
      [cleanCode]
    );
    if (res.rows && res.rows.length > 0) {
      const r = res.rows[0];
      coupon = {
        code: r.code,
        discountType: r.discount_type,
        discountValue: Number(r.discount_value),
        minOrderAmount: Number(r.min_order_amount),
        maxDiscountAmount: r.max_discount_amount ? Number(r.max_discount_amount) : null,
        usageLimit: r.usage_limit,
        timesUsed: r.times_used || 0,
        endDate: new Date(r.end_date),
      };
    }
  } catch (e) {
    // Fallback
  }

  if (!coupon) {
    const mem = getMemoryStore();
    const memCoupon = (mem.coupons || []).find((c) => c.code.toUpperCase() === cleanCode);
    if (memCoupon) {
      coupon = {
        code: memCoupon.code,
        discountType: memCoupon.discount_type || memCoupon.discountType,
        discountValue: Number(memCoupon.discount_value || memCoupon.discountValue),
        minOrderAmount: Number(memCoupon.min_order_amount || memCoupon.minOrderAmount),
        maxDiscountAmount: memCoupon.max_discount_amount ? Number(memCoupon.max_discount_amount) : null,
        usageLimit: memCoupon.usage_limit || memCoupon.usageLimit,
        timesUsed: memCoupon.times_used || 0,
        endDate: new Date(memCoupon.end_date || memCoupon.endDate),
      };
    } else {
      // Check INITIAL_COUPONS default list
      const staticCoupon = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
      if (staticCoupon) {
        coupon = staticCoupon;
      }
    }
  }

  if (!coupon) {
    return { valid: false, reason: 'Coupon code not found or expired.' };
  }

  // Check expiration
  if (coupon.endDate < new Date()) {
    return { valid: false, reason: 'Coupon has expired.' };
  }

  // Check minimum order amount
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount of ₹${coupon.minOrderAmount.toFixed(0)} required for this code.`,
    };
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, reason: 'Coupon usage limit has been reached.' };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(subtotal, Number(discount.toFixed(2)));

  return {
    valid: true,
    discountAmount: discount,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  };
}
