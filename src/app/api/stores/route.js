import { getFeaturedStores } from '../../../server/data/catalog';
import { query } from '../../../server/db/client';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    try {
      let sql = 'SELECT * FROM stores WHERE 1=1';
      const params = [];
      if (category) {
        sql += ' AND category_name = $1';
        params.push(category);
      }
      const res = await query(sql, params);
      if (res.rows && res.rows.length > 0) {
        return Response.json({
          stores: res.rows.map((r) => ({
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
          })),
        });
      }
    } catch (e) {
      // Fallback
    }

    const stores = await getFeaturedStores();
    return Response.json({ stores });
  } catch (err) {
    console.error('Stores API error:', err);
    return Response.json({ error: 'Failed to retrieve stores' }, { status: 500 });
  }
}

