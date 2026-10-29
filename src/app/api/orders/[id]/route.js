import { query, getMemoryStore } from '../../../../server/db/client';
import { getUserFromRequest } from '../../../../server/auth/session';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);

    let order = null;
    let items = [];
    let history = [];

    try {
      const orderRes = await query('SELECT * FROM orders WHERE id = $1', [id]);
      if (orderRes.rows && orderRes.rows.length > 0) {
        order = orderRes.rows[0];

        // Access check: User must own the order or be staff
        if (user && user.role === 'customer' && order.user_id && order.user_id !== user.id) {
          return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
        items = itemsRes.rows || [];

        const histRes = await query(
          'SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC',
          [id]
        );
        history = histRes.rows || [];
      }
    } catch (e) {
      // Memory fallback
    }

    if (!order) {
      const mem = getMemoryStore();
      order = (mem.orders || []).find((o) => o.id === id);
      if (order) {
        items = (mem.orderItems || []).filter((i) => i.order_id === id);
        history = (mem.statusHistory || []).filter((h) => h.order_id === id);
      }
    }

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({
      order: {
        id: order.id,
        status: order.status,
        storeId: order.store_id,
        subtotal: Number(order.item_subtotal),
        deliveryFee: Number(order.delivery_fee),
        taxAmount: Number(order.tax_amount),
        discountAmount: Number(order.discount_amount),
        totalAmount: Number(order.total_amount),
        couponCode: order.coupon_code,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        deliveryAddress: typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address,
        deliveryInstructions: order.delivery_instructions,
        prescriptionVerified: order.prescription_verified,
        createdAt: order.created_at,
        items,
        history,
      },
    });
  } catch (err) {
    console.error('Fetch order detail error:', err);
    return Response.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}

/**
 * Customer cancel order action (permitted only if status is 'placed')
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);
    const body = await request.json();
    const { action, reason } = body;

    if (action !== 'cancel') {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Try DB update
    try {
      const orderRes = await query('SELECT * FROM orders WHERE id = $1', [id]);
      if (orderRes.rows && orderRes.rows.length > 0) {
        const order = orderRes.rows[0];

        if (order.status !== 'placed') {
          return Response.json(
            { error: `Cannot cancel order at stage "${order.status}". Merchant has already started preparation.` },
            { status: 400 }
          );
        }

        // Return stock back to inventory
        const itemsRes = await query('SELECT * FROM order_items WHERE order_id = $1', [id]);
        for (const it of itemsRes.rows) {
          await query('UPDATE products SET stock = stock + $1 WHERE id = $2', [it.quantity, it.product_id]);
        }

        await query(
          'UPDATE orders SET status = $1, cancellation_reason = $2, updated_at = NOW() WHERE id = $3',
          ['cancelled', reason || 'Cancelled by customer', id]
        );

        await query(
          'INSERT INTO order_status_history (order_id, status, notes) VALUES ($1, $2, $3)',
          [id, 'cancelled', `Order cancelled by customer. Reason: ${reason || 'Not specified'}`]
        );

        return Response.json({ success: true, message: 'Order successfully cancelled.' });
      }
    } catch (e) {
      // Memory store fallback
    }

    const mem = getMemoryStore();
    const order = (mem.orders || []).find((o) => o.id === id);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'placed') {
      return Response.json(
        { error: `Cannot cancel order at stage "${order.status}".` },
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    order.cancellation_reason = reason || 'Cancelled by customer';
    mem.statusHistory.push({
      order_id: id,
      status: 'cancelled',
      created_at: new Date().toISOString(),
      notes: `Order cancelled by customer. Reason: ${reason || 'Not specified'}`,
    });

    return Response.json({ success: true, message: 'Order successfully cancelled.' });
  } catch (err) {
    console.error('Cancel order error:', err);
    return Response.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}

