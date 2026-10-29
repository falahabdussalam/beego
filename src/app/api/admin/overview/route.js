import { query, getMemoryStore } from '../../../../server/db/client';
import { requireRole } from '../../../../server/auth/session';
import { INITIAL_PRODUCTS, INITIAL_STORES } from '../../../../server/data/catalog';

export async function GET(request) {
  const auth = await requireRole(request, ['admin']);
  if (!auth.authorized) return auth.response;

  try {
    let orders = [];
    let products = [];
    let stores = [];
    let users = [];

    try {
      const orderRes = await query('SELECT * FROM orders ORDER BY created_at DESC');
      orders = orderRes.rows || [];

      const prodRes = await query('SELECT * FROM products');
      products = prodRes.rows || [];

      const storeRes = await query('SELECT * FROM stores');
      stores = storeRes.rows || [];

      const userRes = await query("SELECT id, name, email, role, created_at FROM users WHERE role = 'customer'");
      users = userRes.rows || [];
    } catch (e) {
      // Memory fallback
    }

    if (orders.length === 0) {
      const mem = getMemoryStore();
      orders = mem.orders || [];
      products = mem.products?.length ? mem.products : INITIAL_PRODUCTS;
      stores = mem.stores?.length ? mem.stores : INITIAL_STORES;
      users = (mem.users || []).filter((u) => u.role === 'customer');
    }

    // Calculate real aggregates
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status === 'delivered').length;
    const pendingOrders = orders.filter((o) => !['delivered', 'cancelled', 'refunded'].includes(o.status)).length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || o.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const lowStockProducts = products.filter((p) => (p.stock ?? 10) <= 5);

    return Response.json({
      metrics: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        activeCustomersCount: users.length,
        totalStoresCount: stores.length,
        lowStockCount: lowStockProducts.length,
      },
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentOrders: orders.slice(0, 8),
    });
  } catch (err) {
    console.error('Admin overview error:', err);
    return Response.json({ error: 'Failed to generate admin overview' }, { status: 500 });
  }
}

