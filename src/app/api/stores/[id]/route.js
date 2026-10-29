import { getStoreById, getProductsByStore } from '../../../../server/data/catalog';
import { saveStore, toggleStoreStatus } from '../../../../server/data/stores';
import { query } from '../../../../server/db/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const store = await getStoreById(id);
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

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingStore = await getStoreById(id);
    if (!existingStore) {
      return Response.json({ error: 'Store not found' }, { status: 404 });
    }

    const updated = await saveStore({
      ...existingStore,
      ...body,
      id,
    });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/stores/${id}`);
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, store: updated });
  } catch (err) {
    console.error('Store update error:', err);
    return Response.json({ error: 'Failed to update store' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === 'toggleStatus') {
      const updated = await toggleStoreStatus(id);
      if (!updated) {
        return Response.json({ error: 'Store not found' }, { status: 404 });
      }

      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/stores/${id}`);
      } catch (e) {
        // Ignored
      }

      return Response.json({ success: true, store: updated });
    }

    const existingStore = await getStoreById(id);
    if (!existingStore) {
      return Response.json({ error: 'Store not found' }, { status: 404 });
    }

    const updated = await saveStore({ ...existingStore, ...body, id });

    try {
      revalidatePath('/', 'layout');
      revalidatePath(`/stores/${id}`);
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, store: updated });
  } catch (err) {
    console.error('Store patch error:', err);
    return Response.json({ error: 'Failed to patch store' }, { status: 500 });
  }
}
