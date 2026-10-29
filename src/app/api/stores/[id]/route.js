import { getStoreById, getProductsByStore } from '../../../../server/data/catalog';
import { query } from '../../../../server/db/client';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    let store = await getStoreById(id);

    try {
      const res = await query('SELECT * FROM stores WHERE id = $1', [id]);
      if (res.rows && res.rows.length > 0) {
        const r = res.rows[0];
        store = {
          id: r.id,
          name: r.name,
          type: r.type,
          categoryName: r.category_name,
          address: r.address,
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          phone: r.phone,
          rating: Number(r.rating),
          deliveryTimeMinutes: r.delivery_time_minutes,
          minOrderAmount: Number(r.min_order_amount),
          isOpen: r.is_open,
          image: r.image_url,
        };
      }
    } catch (e) {
      // Fallback
    }

    if (!store) {
      return Response.json({ error: 'Store not found' }, { status: 404 });
    }

    // Fetch store products from dynamic catalog
    const products = await getProductsByStore(id);

    return Response.json({ store, products });
  } catch (err) {
    console.error('Store detail API error:', err);
    return Response.json({ error: 'Failed to retrieve store details' }, { status: 500 });
  }
}

