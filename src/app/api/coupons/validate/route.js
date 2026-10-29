import { validateCoupon } from '../../../../server/orders/pricing';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== 'string') {
      return Response.json({ error: 'Promo code is required.' }, { status: 400 });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    const result = await validateCoupon(code, orderSubtotal);

    if (!result.valid) {
      return Response.json(
        { valid: false, error: result.reason },
        { status: 400 }
      );
    }

    return Response.json({
      valid: true,
      discountAmount: result.discountAmount,
      coupon: result.coupon,
      message: `Coupon "${result.coupon.code}" applied! You saved ₹${result.discountAmount.toFixed(0)}.`,
    });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return Response.json({ error: 'Internal error validating promo code.' }, { status: 500 });
  }
}

