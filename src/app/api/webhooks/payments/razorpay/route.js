import crypto from 'crypto';
import { query, getMemoryStore } from '../../../../../server/db/client';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (secret) {
      if (!signature) {
        return Response.json({ error: 'Missing webhook signature header' }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payment = event.payload?.payment?.entity;
    const orderId = payment?.notes?.receipt || payment?.order_id;

    console.log(`[Webhook] Razorpay event received: ${eventType} for order: ${orderId}`);

    if (eventType === 'payment.captured' && orderId) {
      // Idempotent update: check if already captured
      try {
        await query(
          `UPDATE orders
           SET payment_status = 'captured', payment_gateway_ref = $1, updated_at = NOW()
           WHERE id = $2 AND payment_status != 'captured'`,
          [payment.id, orderId]
        );
      } catch (e) {
        const mem = getMemoryStore();
        const o = (mem.orders || []).find((x) => x.id === orderId);
        if (o) o.payment_status = 'captured';
      }
    } else if (eventType === 'payment.failed' && orderId) {
      try {
        await query(
          `UPDATE orders
           SET payment_status = 'failed', updated_at = NOW()
           WHERE id = $1 AND payment_status != 'captured'`,
          [orderId]
        );
      } catch (e) {
        // Fallback
      }
    }

    return Response.json({ received: true, event: eventType });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return Response.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

