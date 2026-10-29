import { calculateOrderPricing } from '../../../../server/orders/pricing';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: 'Cart is empty. Add items to validate cart.' },
        { status: 400 }
      );
    }

    const pricing = await calculateOrderPricing(items, couponCode);

    return Response.json({
      valid: true,
      pricing,
    });
  } catch (err) {
    return Response.json(
      {
        valid: false,
        error: err.message || 'Cart validation failed.',
      },
      { status: 400 }
    );
  }
}

