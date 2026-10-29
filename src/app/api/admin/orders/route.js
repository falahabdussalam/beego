import { getAllOrders } from '../../../../server/data/orders';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let orders = await getAllOrders();

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q) ||
          o.storeName?.toLowerCase().includes(q)
      );
    }

    return Response.json({ orders });
  } catch (err) {
    console.error('Admin orders GET error:', err);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

