import { query, getMemoryStore } from '../../../server/db/client';
import { requireRole } from '../../../server/auth/session';

export async function GET(request) {
  const auth = await requireRole(request, ['delivery_partner', 'admin']);
  if (!auth.authorized) return auth.response;

  try {
    // Fetch orders ready for pickup or actively assigned
    let deliveries = [];
    try {
      const res = await query(
        `SELECT o.*, s.name as store_name, s.address as store_address, s.phone as store_phone
         FROM orders o
         JOIN stores s ON o.store_id = s.id
         WHERE o.status IN ('ready_for_pickup', 'picked_up', 'out_for_delivery')
         ORDER BY o.created_at ASC`
      );
      if (res.rows) deliveries = res.rows;
    } catch (e) {
      // Memory fallback
    }

    if (deliveries.length === 0) {
      const mem = getMemoryStore();
      deliveries = (mem.orders || []).filter((o) =>
        ['ready_for_pickup', 'picked_up', 'out_for_delivery'].includes(o.status)
      );
    }

    return Response.json({
      partner: {
        id: auth.user.id,
        name: auth.user.name,
        phone: auth.user.phone,
        vehicle: 'Honda Activa EV (KA-12-EA-4521)',
        zone: 'Virajpete Central 5KM',
        isOnline: true,
        todayDeliveriesCount: 4,
        todayEarnings: '₹480.00',
      },
      deliveries,
    });
  } catch (err) {
    console.error('Delivery portal fetch error:', err);
    return Response.json({ error: 'Failed to load delivery partner tasks' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await requireRole(request, ['delivery_partner', 'admin']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { orderId, newStatus } = body;

    const allowedTransitions = ['picked_up', 'out_for_delivery', 'delivered'];
    if (!allowedTransitions.includes(newStatus)) {
      return Response.json({ error: `Not a permitted driver status change: ${newStatus}` }, { status: 400 });
    }

    try {
      await query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        [newStatus, orderId]
      );
      await query(
        'INSERT INTO order_status_history (order_id, status, notes, updated_by_user_id) VALUES ($1, $2, $3, $4)',
        [orderId, newStatus, `Driver updated status to ${newStatus}.`, auth.user.id]
      );
    } catch (e) {
      const mem = getMemoryStore();
      const o = (mem.orders || []).find((x) => x.id === orderId);
      if (o) o.status = newStatus;
    }

    return Response.json({
      success: true,
      message: `Delivery status updated to "${newStatus}".`,
    });
  } catch (err) {
    console.error('Delivery partner action error:', err);
    return Response.json({ error: 'Failed to update delivery status' }, { status: 500 });
  }
}

