import { getOrderById, updateOrderStatus } from '../../../../../server/data/orders';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    return Response.json({ order });
  } catch (err) {
    console.error('Admin order detail error:', err);
    return Response.json({ error: 'Failed to retrieve order' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, body.status);
    if (!updated) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({ success: true, order: updated });
  } catch (err) {
    console.error('Admin order status update error:', err);
    return Response.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

