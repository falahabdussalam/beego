import { query, getMemoryStore } from '../../../server/db/client';
import { getUserFromRequest } from '../../../server/auth/session';

export async function GET(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return Response.json({ notifications: [] });
    }

    try {
      const res = await query(
        `SELECT n.* FROM notification_records n
         JOIN orders o ON n.order_id = o.id
         WHERE o.user_id = $1
         ORDER BY n.created_at DESC LIMIT 20`,
        [user.id]
      );
      if (res.rows) {
        return Response.json({ notifications: res.rows });
      }
    } catch (e) {
      // Memory fallback
    }

    const mem = getMemoryStore();
    return Response.json({ notifications: mem.notifications || [] });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return Response.json({ notifications: [] });
  }
}

