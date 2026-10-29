import { getAllProducts } from '../../../../server/data/catalog';
import { getAllStores } from '../../../../server/data/stores';
import { getAllOrders } from '../../../../server/data/orders';
import { getSettings } from '../../../../server/data/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [products, stores, orders, settings] = await Promise.all([
      getAllProducts(),
      getAllStores(),
      getAllOrders(),
      getSettings(),
    ]);

    const inStockProducts = products.filter((p) => p.stock > 0);
    const outOfStockProducts = products.filter((p) => p.stock <= 0);
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

    const activeStores = stores.filter((s) => s.isOpen);
    const pendingOrders = orders.filter((o) => ['placed', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status));
    const deliveredOrders = orders.filter((o) => o.status === 'delivered');

    const totalSalesVolume = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return Response.json({
      stats: {
        totalProducts: products.length,
        inStockCount: inStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        lowStockCount: lowStockProducts.length,
        totalStores: stores.length,
        activeStoresCount: activeStores.length,
        totalOrders: orders.length,
        pendingOrdersCount: pendingOrders.length,
        deliveredOrdersCount: deliveredOrders.length,
        totalSalesVolume: Math.round(totalSalesVolume),
        hubOpen: settings.hubOpen,
        announcementActive: Boolean(settings.announcement?.enabled),
      },
      recentOrders: orders.slice(0, 5),
      recentProducts: products.slice(0, 5),
      stores: stores.map((s) => ({ id: s.id, name: s.name, isOpen: s.isOpen, categoryName: s.categoryName })),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return Response.json({ error: 'Failed to compute admin metrics' }, { status: 500 });
  }
}

