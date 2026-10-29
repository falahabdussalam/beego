import { z } from 'zod';
import { query, getMemoryStore } from '../../../server/db/client';
import { requireRole } from '../../../server/auth/session';

const AddressSchema = z.object({
  tag: z.enum(['Home', 'Work', 'Other']).default('Home'),
  contactName: z.string().optional(),
  phone: z.string().min(10, 'Contact phone is required'),
  house: z.string().min(1, 'House / Building details required'),
  street: z.string().min(1, 'Street name required'),
  landmark: z.string().optional(),
  area: z.string().min(1, 'Area / Locality is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  isDefault: z.boolean().default(false),
});

export async function GET(request) {
  const auth = await requireRole(request, ['customer', 'admin', 'store_manager', 'delivery_partner']);
  if (!auth.authorized) return auth.response;

  try {
    const res = await query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [auth.user.id]
    );

    if (res.rows && res.rows.length > 0) {
      return Response.json({
        addresses: res.rows.map((r) => ({
          id: r.id,
          tag: r.tag,
          contactName: r.contact_name,
          phone: r.contact_phone,
          house: r.house_building,
          street: r.street_road,
          landmark: r.landmark,
          area: r.area_locality,
          city: r.city,
          pincode: r.pincode,
          lat: Number(r.latitude),
          lng: Number(r.longitude),
          isDefault: r.is_default,
        })),
      });
    }

    // In memory store fallback
    const mem = getMemoryStore();
    const userAddresses = (mem.addresses || []).filter((a) => a.userId === auth.user.id);
    return Response.json({ addresses: userAddresses });
  } catch (err) {
    console.error('Fetch addresses error:', err);
    return Response.json({ addresses: [] });
  }
}

export async function POST(request) {
  const auth = await requireRole(request, ['customer', 'admin', 'store_manager', 'delivery_partner']);
  if (!auth.authorized) return auth.response;

  try {
    const body = await request.json();
    const parsed = AddressSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Address validation error', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      tag,
      contactName,
      phone,
      house,
      street,
      landmark,
      area,
      lat,
      lng,
      isDefault,
    } = parsed.data;

    const addressId = crypto.randomUUID();

    try {
      await query(
        `INSERT INTO addresses (
          id, user_id, tag, contact_name, contact_phone, house_building,
          street_road, landmark, area_locality, latitude, longitude, is_default
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          addressId,
          auth.user.id,
          tag,
          contactName || auth.user.name,
          phone,
          house,
          street,
          landmark || null,
          area,
          lat,
          lng,
          isDefault,
        ]
      );
    } catch (e) {
      const mem = getMemoryStore();
      if (!mem.addresses) mem.addresses = [];
      mem.addresses.push({
        id: addressId,
        userId: auth.user.id,
        tag,
        contactName: contactName || auth.user.name,
        phone,
        house,
        street,
        landmark: landmark || '',
        area,
        lat,
        lng,
        isDefault,
      });
    }

    return Response.json({
      success: true,
      message: 'Address saved successfully!',
      address: {
        id: addressId,
        tag,
        phone,
        house,
        street,
        landmark,
        area,
        lat,
        lng,
      },
    });
  } catch (err) {
    console.error('Save address error:', err);
    return Response.json({ error: 'Failed to save delivery address' }, { status: 500 });
  }
}

