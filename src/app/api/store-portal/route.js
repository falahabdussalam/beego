import { query, getMemoryStore } from '../../../server/db/client';
import { requireRole } from '../../../server/auth/session';
import { INITIAL_PRODUCTS, INITIAL_STORES } from '../../../server/data/catalog';

export async function GET(request) {
  const auth = await requireRole(request, ['store_manager', 'admin']);
  if (!auth.authorized) return auth.response;

  try {
    // For demo/development store manager, assign to Coorg Heritage Kitchen
    const assignedStoreId = 'store_coorg_heritage';

    const store = INITIAL_STORES.find((s) => s.id === assignedStoreId);
    const storeProducts = INITIAL_PRODUCTS.filter((p) => p.storeId === assignedStoreId);

    // Fetch store orders
    let storeOrders = [];
    try {
      const res = await query(
        'SELECT * FROM orders WHERE store_id = $1 ORDER BY created_at DESC',
        [assignedStoreId]
      );
      if (res.rows) storeOrders = res.rows;
    } catch (e) {
      // Memory fallback
    }

    if (storeOrders.length === 0) {
      const mem = getMemoryStore();
      storeOrders = (mem.orders || []).filter((o) => o.store_id === assignedStoreId);
    }

    return Response.json({
      store,
      inventory: storeProducts,
      orders: storeOrders,
    });
  } catch (err) {
    console.error('Store portal fetch error:', err);
    return Response.json({ error: 'Failed to load store manager data' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await requireRole(request, ['store_manager', 'admin']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const { action, productId, newStock, isOpen } = body;

    const assignedStoreId = 'store_coorg_heritage';

    if (action === 'update_stock' && productId) {
      const stockVal = parseInt(newStock, 10);
      if (isNaN(stockVal) || stockVal < 0) {
        return Response.json({ error: 'Stock must be 0 or greater' }, { status: 400 });
      }

      try {
        await query('UPDATE products SET stock = $1 WHERE id = $2 AND store_id = $3', [
          stockVal,
          productId,
          assignedStoreId,
        ]);
      } catch (e) {
        const mem = getMemoryStore();
        const p = (mem.products || []).find((x) => x.id === productId && x.storeId === assignedStoreId);
        if (p) p.stock = stockVal;
      }

      return Response.json({ success: true, message: `Stock updated to ${stockVal}` });
    }

    if (action === 'toggle_open') {
      try {
        await query('UPDATE stores SET is_open = $1 WHERE id = $2', [isOpen, assignedStoreId]);
      } catch (e) {
        const mem = getMemoryStore();
        const s = (mem.stores || []).find((x) => x.id === assignedStoreId);
        if (s) s.isOpen = isOpen;
      }

      return Response.json({ success: true, message: `Store status updated to ${isOpen ? 'Open' : 'Closed'}` });
    }

    return Response.json({ error: 'Invalid store action' }, { status: 400 });
  } catch (err) {
    console.error('Store manager update error:', err);
    return Response.json({ error: 'Internal update error' }, { status: 500 });
  }
}

