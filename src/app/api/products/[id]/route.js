import { getProductById, saveProduct, deleteProduct, toggleProductStock } from '../../../../server/data/catalog';
import { query } from '../../../../server/db/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const price = body.price !== undefined ? parseFloat(body.price) : existingProduct.price;
    const originalPrice = body.originalPrice !== undefined ? parseFloat(body.originalPrice) : existingProduct.originalPrice;

    const updatedData = {
      ...existingProduct,
      ...body,
      id,
      price,
      originalPrice,
      discountPercent: body.discountPercent !== undefined 
        ? parseInt(body.discountPercent, 10) 
        : (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0),
      unit: body.unit || existingProduct.unit,
      stock: body.stock !== undefined ? parseInt(body.stock, 10) : existingProduct.stock,
      storeId: body.storeId || existingProduct.storeId,
      storeName: body.storeName || existingProduct.storeName,
      categoryId: body.categoryId || existingProduct.categoryId,
      categoryName: body.categoryName || existingProduct.categoryName,
      isPrescriptionRequired: body.isPrescriptionRequired !== undefined 
        ? Boolean(body.isPrescriptionRequired) 
        : existingProduct.isPrescriptionRequired,
      description: body.description !== undefined ? body.description : existingProduct.description,
      image: body.image !== undefined ? body.image : existingProduct.image,
      tags: Array.isArray(body.tags) ? body.tags : existingProduct.tags,
    };

    const savedProduct = await saveProduct(updatedData);

    // Also update PostgreSQL if available
    try {
      await query(
        `UPDATE products SET
           name = $1,
           price = $2,
           original_price = $3,
           discount_percent = $4,
           unit = $5,
           stock = $6,
           store_id = $7,
           category_id = $8,
           is_prescription_required = $9,
           image_url = $10,
           description = $11,
           updated_at = NOW()
         WHERE id = $12`,
        [
          savedProduct.name,
          savedProduct.price,
          savedProduct.originalPrice,
          savedProduct.discountPercent,
          savedProduct.unit,
          savedProduct.stock,
          savedProduct.storeId,
          savedProduct.categoryId,
          savedProduct.isPrescriptionRequired,
          savedProduct.image,
          savedProduct.description,
          id,
        ]
      );
    } catch (e) {
      // Ignored
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/products/${id}`);
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, product: savedProduct });
  } catch (err) {
    console.error('Product update error:', err);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'toggleStock') {
      const updatedProduct = await toggleProductStock(id);
      if (!updatedProduct) {
        return Response.json({ error: 'Product not found' }, { status: 404 });
      }

      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/products/${id}`);
      } catch (e) {
        // Ignored
      }

      return Response.json({ success: true, product: updatedProduct });
    }

    // Direct partial patch
    const existing = await getProductById(id);
    if (!existing) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const saved = await saveProduct({ ...existing, ...body, id });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/products/${id}`);
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, product: saved });
  } catch (err) {
    console.error('Product patch error:', err);
    return Response.json({ error: 'Failed to patch product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteProduct(id);

    try {
      await query('DELETE FROM products WHERE id = $1', [id]);
    } catch (e) {
      // Memory fallback
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/products/${id}`);
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product delete API error:', err);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
