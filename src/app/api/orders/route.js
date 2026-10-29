import { z } from 'zod';
import { query, withTransaction, getMemoryStore } from '../../../server/db/client';
import { getUserFromRequest } from '../../../server/auth/session';
import { calculateOrderPricing } from '../../../server/orders/pricing';
import { calculateDistanceKm, VIRAJPET_CENTER_COORDS } from '../../../lib/geo';

// In-memory idempotency cache to prevent accidental double-submits
const processedIdempotencyKeys = new Set();

const OrderCreateSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      quantity: z.number().int().positive('Quantity must be greater than 0'),
    })
  ).min(1, 'Cart cannot be empty'),
  deliveryAddress: z.object({
    house: z.string().min(1),
    street: z.string().min(1),
    area: z.string().min(1),
    landmark: z.string().optional(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    contactName: z.string().optional(),
    contactPhone: z.string().min(10, 'Valid contact phone required'),
  }),
  paymentMethod: z.enum(['cod', 'razorpay_test', 'whatsapp']).default('whatsapp'),
  couponCode: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

function generateOrderNumber() {
  const d = new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BEE-${yearMonth}-${randomSuffix}`;
}

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const res = await query(
        `SELECT o.*, s.name as store_name
         FROM orders o
         LEFT JOIN stores s ON o.store_id = s.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [user.id]
      );
      if (res.rows) {
        return Response.json({ orders: res.rows });
      }
    } catch (e) {
      // Fallback to memory store
    }

    const mem = getMemoryStore();
    const userOrders = (mem.orders || []).filter((o) => o.user_id === user.id);
    return Response.json({ orders: userOrders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return Response.json({ error: 'Failed to retrieve orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    const body = await request.json();

    const parsed = OrderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: 'Order validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      items,
      deliveryAddress,
      paymentMethod,
      couponCode,
      deliveryInstructions,
      idempotencyKey,
    } = parsed.data;

    // Idempotency check
    if (idempotencyKey) {
      if (processedIdempotencyKeys.has(idempotencyKey)) {
        return Response.json(
          { error: 'Duplicate order submission detected. Please check your order history.' },
          { status: 409 }
        );
      }
      processedIdempotencyKeys.add(idempotencyKey);
    }

    // 1. Serviceability Check against Virajpete 5 km geofence
    const distKm = calculateDistanceKm(
      VIRAJPET_CENTER_COORDS.lat,
      VIRAJPET_CENTER_COORDS.lng,
      deliveryAddress.lat,
      deliveryAddress.lng
    );

    if (distKm > 5.0) {
      return Response.json(
        {
          error: `Delivery address is ${distKm.toFixed(1)} km from Virajpete Town Center. Active coverage is restricted to 5.0 km.`,
        },
        { status: 422 }
      );
    }

    // 2. Server-side authoritative price and stock validation
    const pricing = await calculateOrderPricing(items, couponCode, distKm);

    // Check prescription requirement
    const hasPrescriptionItems = pricing.items.some((i) => i.isPrescriptionRequired);

    const orderNumber = generateOrderNumber();
    const orderRecord = {
      id: orderNumber,
      user_id: user ? user.id : null,
      store_id: pricing.storeId,
      status: 'placed',
      item_subtotal: pricing.subtotal,
      delivery_fee: pricing.deliveryFee,
      tax_amount: pricing.taxAmount,
      discount_amount: pricing.discountAmount,
      total_amount: pricing.totalAmount,
      coupon_code: couponCode ? couponCode.trim().toUpperCase() : null,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' || paymentMethod === 'whatsapp' ? 'pending' : 'authorized',
      delivery_address: deliveryAddress,
      delivery_instructions: deliveryInstructions || null,
      prescription_verified: !hasPrescriptionItems,
      created_at: new Date().toISOString(),
    };

    // 3. Atomic Database Transaction (or memory transaction)
    await withTransaction(async (client) => {
      // Atomic stock reduction & overselling protection
      for (const item of pricing.items) {
        try {
          const updateRes = await client.query(
            'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock',
            [item.quantity, item.productId]
          );
          if (updateRes.rows && updateRes.rows.length === 0) {
            throw new Error(`Insufficient stock for "${item.name}". Stock was reserved by another buyer.`);
          }
        } catch (dbErr) {
          // If in memory fallback mode, check and deduct directly
          const mem = getMemoryStore();
          const prod = (mem.products || []).find((p) => p.id === item.productId);
          if (prod) {
            if (prod.stock < item.quantity) {
              throw new Error(`Insufficient stock for "${item.name}".`);
            }
            prod.stock -= item.quantity;
          }
        }
      }

      // Insert Order
      try {
        await client.query(
          `INSERT INTO orders (
            id, user_id, store_id, status, item_subtotal, delivery_fee, tax_amount,
            discount_amount, total_amount, coupon_code, payment_method, payment_status,
            delivery_address, delivery_instructions, prescription_verified
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            orderRecord.id,
            orderRecord.user_id,
            orderRecord.store_id,
            orderRecord.status,
            orderRecord.item_subtotal,
            orderRecord.delivery_fee,
            orderRecord.tax_amount,
            orderRecord.discount_amount,
            orderRecord.total_amount,
            orderRecord.coupon_code,
            orderRecord.payment_method,
            orderRecord.payment_status,
            JSON.stringify(orderRecord.delivery_address),
            orderRecord.delivery_instructions,
            orderRecord.prescription_verified,
          ]
        );

        // Insert Order Items
        for (const item of pricing.items) {
          await client.query(
            `INSERT INTO order_items (
              order_id, product_id, product_name, unit_price, quantity, total_price, is_prescription_required
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              orderRecord.id,
              item.productId,
              item.name,
              item.unitPrice,
              item.quantity,
              item.totalPrice,
              item.isPrescriptionRequired,
            ]
          );
        }

        // Insert Status History
        await client.query(
          `INSERT INTO order_status_history (order_id, status, notes)
           VALUES ($1, 'placed', 'Order placed successfully by customer.')`,
          [orderRecord.id]
        );

        // Update coupon times_used
        if (orderRecord.coupon_code) {
          await client.query(
            'UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = $1',
            [orderRecord.coupon_code]
          );
        }
      } catch (dbErr) {
        // Fallback to memory store
        const mem = getMemoryStore();
        if (!mem.orders) mem.orders = [];
        if (!mem.orderItems) mem.orderItems = [];
        if (!mem.statusHistory) mem.statusHistory = [];

        mem.orders.push(orderRecord);
        for (const item of pricing.items) {
          mem.orderItems.push({
            order_id: orderRecord.id,
            ...item,
          });
        }
        mem.statusHistory.push({
          order_id: orderRecord.id,
          status: 'placed',
          created_at: new Date().toISOString(),
          notes: 'Order placed in Virajpete.',
        });
      }
    });

    return Response.json(
      {
        success: true,
        message: 'Order placed successfully!',
        orderId: orderRecord.id,
        order: {
          id: orderRecord.id,
          status: orderRecord.status,
          totalAmount: orderRecord.total_amount,
          paymentMethod: orderRecord.payment_method,
          estimatedDeliveryMinutes: '25-35 mins',
          hasPrescriptionItems,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Order creation error:', err);
    return Response.json(
      { error: err.message || 'Failed to place order.' },
      { status: 400 }
    );
  }
}

