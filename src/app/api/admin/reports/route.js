import { query, getMemoryStore } from '../../../../server/db/client';
import { requireRole } from '../../../../server/auth/session';

export async function GET(request) {
  const auth = await requireRole(request, ['admin']);
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    let orders = [];
    try {
      const res = await query('SELECT * FROM orders ORDER BY created_at DESC');
      if (res.rows) orders = res.rows;
    } catch (e) {
      // Memory fallback
    }

    if (orders.length === 0) {
      const mem = getMemoryStore();
      orders = mem.orders || [];
    }

    // CSV Export option
    if (format === 'csv') {
      const headers = ['Order ID', 'Store', 'Status', 'Subtotal', 'Delivery Fee', 'Total Amount', 'Payment Method', 'Created At'];
      const rows = orders.map((o) => [
        o.id,
        o.store_id || o.storeId,
        o.status,
        Number(o.item_subtotal || o.subtotal || 0).toFixed(2),
        Number(o.delivery_fee || o.deliveryFee || 0).toFixed(2),
        Number(o.total_amount || o.totalAmount || 0).toFixed(2),
        o.payment_method || o.paymentMethod,
        `"${new Date(o.created_at || o.createdAt).toISOString()}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="beego_sales_report_virajpete.csv"',
        },
      });
    }

    // JSON Reporting aggregates
    const totalSales = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || o.totalAmount || 0), 0);

    const ordersByStatus = {};
    orders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    return Response.json({
      summary: {
        totalOrders: orders.length,
        totalSales: Number(totalSales.toFixed(2)),
        ordersByStatus,
      },
      orders,
    });
  } catch (err) {
    console.error('Reports route error:', err);
    return Response.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

