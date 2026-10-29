import { query, getMemoryStore } from '../../../../server/db/client';
import { requireRole } from '../../../../server/auth/session';

export async function GET(request) {
  const auth = await requireRole(request, ['admin']);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    try {
      let sql = 'SELECT * FROM orders WHERE 1=1';
      const params = [];
      let idx = 1;

      if (status && status !== 'all') {
        sql += ` AND status = $${idx++}`;
        params.push(status);
      }
      if (search) {
        sql += ` AND (LOWER(id) LIKE $${idx} OR LOWER(store_id) LIKE $${idx})`;
        params.push(`%${search.toLowerCase()}%`);
        idx++;
      }
      sql += ' ORDER BY created_at DESC';

      const res = await query(sql, params);
      if (res.rows) {
        return Response.json({ orders: res.rows });
      }
    } catch (e) {
      // Memory fallback
    }

    const mem = getMemoryStore();
    let orders = mem.orders || [];
    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }
    if (search) {
      orders = orders.filter((o) => o.id.toLowerCase().includes(search.toLowerCase()));
    }

    return Response.json({ orders });
  } catch (err) {
    console.error('Admin orders fetch error:', err);
    return Response.json({ error: 'Failed to fetch admin orders' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await requireRole(request, ['admin']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { orderId, newStatus, notes } = body;

    const validStatuses = [
      'placed',
      'accepted',
      'preparing',
      'ready_for_pickup',
      'picked_up',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded',
    ];

    if (!validStatuses.includes(newStatus)) {
      return Response.json({ error: `Invalid order status: ${newStatus}` }, { status: 400 });
    }

    try {
      await query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
        [newStatus, orderId]
      );
      await query(
        'INSERT INTO order_status_history (order_id, status, notes, updated_by_user_id) VALUES ($1, $2, $3, $4)',
        [orderId, newStatus, notes || `Status updated to ${newStatus} by Administrator.`, auth.user.id]
      );
    } catch (e) {
      const mem = getMemoryStore();
      const o = (mem.orders || []).find((x) => x.id === orderId);
      if (o) {
        o.status = newStatus;
        if (!mem.statusHistory) mem.statusHistory = [];
        mem.statusHistory.push({
          order_id: orderId,
          status: newStatus,
          notes: notes || `Status updated to ${newStatus} by Admin.`,
          created_at: new Date().toISOString(),
        });
      }
    }

    return Response.json({ success: true, message: `Order ${orderId} updated to ${newStatus}` });
  } catch (err) {
    console.error('Admin order status update error:', err);
    return Response.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

