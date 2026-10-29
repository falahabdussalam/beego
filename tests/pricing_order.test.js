import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPricing, validateCoupon } from '../src/server/orders/pricing.js';

test('Server pricing engine calculates correct subtotal, taxes and free delivery', async () => {
  // Test item: 2x Pandi Curry Meal (₹260 each = ₹520)
  const items = [
    {
      id: 'prod_pandi_curry_meal',
      quantity: 2,
    },
  ];

  const pricing = await calculateOrderPricing(items);
  assert.equal(pricing.subtotal, 520.00);
  // >= 499 threshold should have 0 delivery fee
  assert.equal(pricing.deliveryFee, 0.00);
  // 5% tax = 26.00
  assert.equal(pricing.taxAmount, 26.00);
  assert.equal(pricing.totalAmount, 546.00);
});

test('Delivery fee applied when subtotal is below ₹499', async () => {
  // 1x Pandi Curry Meal (₹260)
  const items = [
    {
      id: 'prod_pandi_curry_meal',
      quantity: 1,
    },
  ];

  const pricing = await calculateOrderPricing(items);
  assert.equal(pricing.subtotal, 260.00);
  // Below 499 should have ₹35 delivery fee
  assert.equal(pricing.deliveryFee, 35.00);
  assert.equal(pricing.totalAmount, 260.00 + 35.00 + 13.00); // subtotal + fee + tax
});

test('Coupon BEEGO50 applies flat ₹50 discount for orders above ₹199', async () => {
  const result = await validateCoupon('BEEGO50', 300);
  assert.equal(result.valid, true);
  assert.equal(result.discountAmount, 50.00);
  assert.equal(result.coupon.code, 'BEEGO50');
});

test('Coupon fails when order does not meet minimum order amount', async () => {
  const result = await validateCoupon('BEEGO50', 100);
  assert.equal(result.valid, false);
  assert.ok(result.reason.includes('Minimum order amount'));
});

test('Single store cart enforcement: items from different stores throw error', async () => {
  const mixedItems = [
    { id: 'prod_pandi_curry_meal', quantity: 1 }, // from store_coorg_heritage
    { id: 'prod_coorg_black_pepper', quantity: 1 }, // from store_viraj_provisions
  ];

  await assert.rejects(
    async () => {
      await calculateOrderPricing(mixedItems);
    },
    {
      message: 'All items in the cart must be from the same merchant store.',
    }
  );
});

