import { getProductById } from '../../../../server/data/catalog';
import { query } from '../../../../server/db/client';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Try DB query
    try {
      const res = await query('SELECT * FROM products WHERE id = $1', [id]);
      if (res.rows && res.rows.length > 0) {
        const row = res.rows[0];
        return Response.json({
          product: {
            id: row.id,
            storeId: row.store_id,
            categoryId: row.category_id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            originalPrice: row.original_price ? Number(row.original_price) : null,
            discountPercent: row.discount_percent,
            unit: row.unit,
            stock: row.stock,
            isPrescriptionRequired: row.is_prescription_required,
            image: row.image_url,
            tags: row.tags || [],
          },
        });
      }
    } catch (e) {
      // Fallback
    }

    const product = await getProductById(id);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ product });
  } catch (err) {
    console.error('Product detail API error:', err);
    return Response.json({ error: 'Failed to retrieve product details' }, { status: 500 });
  }
}

