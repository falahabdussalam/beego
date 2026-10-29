import { getAllProducts, saveProduct, searchCatalog } from '../../../server/data/catalog';
import { query } from '../../../server/db/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const storeId = searchParams.get('storeId') || '';
    const sort = searchParams.get('sort') || '';
    const prescription = searchParams.get('prescription');

    // Attempt DB query if active
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
      // Fallback to dynamic persistent file store
    }

    let products = await searchCatalog(search, category, sort);

    if (storeId) {
      products = products.filter((p) => p.storeId === storeId);
    }
    if (prescription === 'true') {
      products = products.filter((p) => p.isPrescriptionRequired);
    } else if (prescription === 'false') {
      products = products.filter((p) => !p.isPrescriptionRequired);
    }

    return Response.json({ products });
  } catch (err) {
    console.error('Products API GET error:', err);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return Response.json({ error: 'Product name is required.' }, { status: 400 });
    }

    const price = parseFloat(body.price);
    if (isNaN(price) || price < 0) {
      return Response.json({ error: 'Valid product price is required.' }, { status: 400 });
    }

    if (!body.storeId) {
      return Response.json({ error: 'Store selection is required.' }, { status: 400 });
    }

    if (!body.categoryId) {
      return Response.json({ error: 'Category selection is required.' }, { status: 400 });
    }

    const savedProduct = await saveProduct({
      name: body.name.trim(),
      price,
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : price,
      discountPercent: body.discountPercent ? parseInt(body.discountPercent, 10) : 0,
      unit: body.unit ? body.unit.trim() : '1 unit',
      stock: body.stock !== undefined ? parseInt(body.stock, 10) : 20,
      storeId: body.storeId,
      storeName: body.storeName,
      categoryId: body.categoryId,
      categoryName: body.categoryName,
      description: body.description ? body.description.trim() : '',
      image: body.image ? body.image.trim() : '',
      isPrescriptionRequired: Boolean(body.isPrescriptionRequired),
      tags: Array.isArray(body.tags) ? body.tags : [],
    });

    // Also persist to PostgreSQL if available
    try {
      await query(
        `INSERT INTO products (id, store_id, category_id, name, description, price, original_price, discount_percent, unit, stock, is_prescription_required, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           image_url = EXCLUDED.image_url`,
        [
          savedProduct.id,
          savedProduct.storeId,
          savedProduct.categoryId,
          savedProduct.name,
          savedProduct.description,
          savedProduct.price,
          savedProduct.originalPrice,
          savedProduct.discountPercent,
          savedProduct.unit,
          savedProduct.stock,
          savedProduct.isPrescriptionRequired,
          savedProduct.image,
        ]
      );
    } catch (e) {
      // Ignored if DB is in memory mode
    }

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, product: savedProduct }, { status: 201 });
  } catch (err) {
    console.error('Products API POST error:', err);
    return Response.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
