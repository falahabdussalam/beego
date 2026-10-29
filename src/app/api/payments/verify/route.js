import { getPaymentProvider } from '../../../../server/payments/provider';
import { query, getMemoryStore } from '../../../../server/db/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, gatewayOrderId, paymentId, signature } = body;

    if (!orderId || !paymentId) {
      return Response.json(
        { error: 'Order ID and Payment ID are required for verification.' },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const verification = await provider.verifyPaymentSignature({
      orderId: gatewayOrderId || orderId,
      paymentId,
      signature,
    });

    if (!verification.isValid) {
      return Response.json(
        { error: 'Payment signature verification failed.', reason: verification.reason },
        { status: 400 }
      );
    }

    // Update order status in DB
    try {
      await query(
        `UPDATE orders
         SET payment_status = 'captured', payment_gateway_ref = $1, updated_at = NOW()
         WHERE id = $2`,
        [paymentId, orderId]
      );

      await query(
        `INSERT INTO payment_records (order_id, amount, currency, provider, gateway_payment_id, status)
         SELECT id, total_amount, 'INR', $1, $2, 'captured'
         FROM orders WHERE id = $3`,
        [provider.constructor.name, paymentId, orderId]
      );
    } catch (e) {
      // Memory fallback
      const mem = getMemoryStore();
      const order = (mem.orders || []).find((o) => o.id === orderId);
      if (order) {
        order.payment_status = 'captured';
        order.payment_gateway_ref = paymentId;
      }
    }

    return Response.json({
      success: true,
      message: 'Payment verified and captured successfully!',
      paymentId,
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return Response.json({ error: 'Server error during payment verification.' }, { status: 500 });
  }
}

