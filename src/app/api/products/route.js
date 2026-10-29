import { searchCatalog, INITIAL_PRODUCTS } from '../../../server/data/catalog';
import { query } from '../../../server/db/client';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const storeId = searchParams.get('storeId') || '';
    const sort = searchParams.get('sort') || '';
    const prescription = searchParams.get('prescription');

    // Attempt DB query
    try {
      let sql = 'SELECT * FROM products WHERE is_active = true';
      const params = [];
      let paramIndex = 1;

      if (category && category !== 'all') {
        sql += ` AND category_id = $${paramIndex++}`;
        params.push(category);
      }

      if (storeId) {
        sql += ` AND store_id = $${paramIndex++}`;
        params.push(storeId);
      }

      if (search) {
        sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
        params.push(`%${search.toLowerCase()}%`);
        paramIndex++;
      }

      if (prescription === 'true') {
        sql += ` AND is_prescription_required = true`;
      } else if (prescription === 'false') {
        sql += ` AND is_prescription_required = false`;
      }

      if (sort === 'price_asc') {
        sql += ' ORDER BY price ASC';
      } else if (sort === 'price_desc') {
        sql += ' ORDER BY price DESC';
      } else {
        sql += ' ORDER BY created_at DESC';
      }

      const res = await query(sql, params);
      if (res.rows && res.rows.length > 0) {
        return Response.json({
          products: res.rows.map((row) => ({
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
          })),
        });
      }
    } catch (dbErr) {
      // Fallback to in-memory search
    }

    const filtered = await searchCatalog(search, category, sort);
    let finalProducts = filtered;

    if (storeId) {
      finalProducts = finalProducts.filter((p) => p.storeId === storeId);
    }
    if (prescription === 'true') {
      finalProducts = finalProducts.filter((p) => p.isPrescriptionRequired);
    } else if (prescription === 'false') {
      finalProducts = finalProducts.filter((p) => !p.isPrescriptionRequired);
    }

    return Response.json({ products: finalProducts });
  } catch (err) {
    console.error('Products API error:', err);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

