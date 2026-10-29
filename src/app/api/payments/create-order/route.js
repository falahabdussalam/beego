import { getPaymentProvider } from '../../../../server/payments/provider';
import { query, getMemoryStore } from '../../../../server/db/client';
import { getUserFromRequest } from '../../../../server/auth/session';

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Look up order to get exact server amount
    let order = null;
    try {
      const res = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
      if (res.rows && res.rows.length > 0) order = res.rows[0];
    } catch (e) {
      // Memory fallback
    }

    if (!order) {
      const mem = getMemoryStore();
      order = (mem.orders || []).find((o) => o.id === orderId);
    }

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const provider = getPaymentProvider();
    const gatewayOrder = await provider.createGatewayOrder({
      orderId: order.id,
      amount: Number(order.total_amount || order.totalAmount),
      currency: 'INR',
    });

    return Response.json({
      success: true,
      gatewayOrder,
    });
  } catch (err) {
    console.error('Create payment order error:', err);
    return Response.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}

