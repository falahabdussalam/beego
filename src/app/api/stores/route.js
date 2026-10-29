import { getFeaturedStores } from '../../../server/data/catalog';
import { saveStore } from '../../../server/data/stores';
import { query } from '../../../server/db/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let stores = await getFeaturedStores();

    if (category && category !== 'all') {
      stores = stores.filter((s) => s.categoryName?.toLowerCase() === category.toLowerCase());
    }

    return Response.json({ stores });
  } catch (err) {
    console.error('Stores API error:', err);
    return Response.json({ error: 'Failed to retrieve stores' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return Response.json({ error: 'Store name is required' }, { status: 400 });
    }

    const newStore = await saveStore({
      name: body.name.trim(),
      type: body.type || 'Merchant',
      categoryName: body.categoryName || 'General',
      address: body.address || 'Virajpete, Kodagu',
      phone: body.phone || '+91 8274 257000',
      rating: body.rating ? Number(body.rating) : 4.8,
      deliveryTimeMinutes: body.deliveryTimeMinutes || '20-30',
      minOrderAmount: body.minOrderAmount ? Number(body.minOrderAmount) : 50,
      isOpen: body.isOpen !== undefined ? Boolean(body.isOpen) : true,
      image: body.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      licenseNumber: body.licenseNumber || null,
    });

    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      // Ignored
    }

    return Response.json({ success: true, store: newStore }, { status: 201 });
  } catch (err) {
    console.error('Store creation error:', err);
    return Response.json({ error: 'Failed to create store' }, { status: 500 });
  }
}
