import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { query, testConnection, getMemoryStore } from './client.js';
import { INITIAL_STORES, INITIAL_PRODUCTS } from '../data/catalog.js';
import { CATEGORIES_DATA } from '../data/categories.js';

export async function runSeed() {
  console.log('--- BeeGo Database Seed Runner ---');
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('BeeGo@2026Pass!', salt);

  const isConnected = await testConnection();

  const starterUsers = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      name: 'BeeGo Administrator',
      email: 'admin@beegodelivery.in',
      phone: '+91 9480112233',
      role: 'admin',
      password_hash: defaultPasswordHash,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      name: 'Ramesh Thimmaiah (Store Manager)',
      email: 'manager@coorgheritage.in',
      phone: '+91 9480223344',
      role: 'store_manager',
      password_hash: defaultPasswordHash,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      name: 'Kavitha Bopaiah (Delivery Partner)',
      email: 'driver@beegodelivery.in',
      phone: '+91 9480334455',
      role: 'delivery_partner',
      password_hash: defaultPasswordHash,
    },
    {
      id: 'd0000000-0000-0000-0000-000000000004',
      name: 'Virajpete Customer',
      email: 'customer@beegodelivery.in',
      phone: '+91 9480445566',
      role: 'customer',
      password_hash: defaultPasswordHash,
    },
  ];

  const starterCoupons = [
    {
      code: 'BEEGO50',
      description: '₹50 Flat OFF on orders above ₹199',
      discount_type: 'fixed',
      discount_value: 50.0,
      min_order_amount: 199.0,
      max_discount_amount: 50.0,
      usage_limit: 500,
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      code: 'FIRSTORDER',
      description: '20% OFF on your first Virajpete order',
      discount_type: 'percentage',
      discount_value: 20.0,
      min_order_amount: 149.0,
      max_discount_amount: 100.0,
      usage_limit: 1000,
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      code: 'FREESHIP',
      description: 'Free Delivery for orders above ₹299',
      discount_type: 'fixed',
      discount_value: 35.0,
      min_order_amount: 299.0,
      max_discount_amount: 35.0,
      usage_limit: 200,
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const starterZone = {
    name: 'Virajpete Central 5KM Zone',
    center_lat: 12.2039,
    center_lng: 75.8037,
    radius_km: 5.0,
    base_delivery_fee: 35.0,
    free_delivery_threshold: 499.0,
    min_order_amount: 50.0,
  };

  if (!isConnected) {
    console.log('Populating development memory store with starter records...');
    const mem = getMemoryStore();
    mem.users = starterUsers;
    mem.coupons = starterCoupons;
    mem.stores = INITIAL_STORES;
    mem.products = INITIAL_PRODUCTS;
    mem.categories = CATEGORIES_DATA;
    mem.deliveryPartners = [
      {
        id: 'dp-1',
        user_id: starterUsers[2].id,
        full_name: 'Kavitha Bopaiah',
        phone: '+91 9480334455',
        vehicle_type: 'Honda Activa (EV)',
        vehicle_number: 'KA-12-EA-4521',
        is_online: true,
        current_lat: 12.2045,
        current_lng: 75.8035,
        rating: 4.9,
        total_deliveries: 42,
      },
    ];
    console.log('✓ Memory store successfully seeded with starter users, stores, products, and coupons!');
    return { success: true };
  }

  try {
    // 1. Seed Users
    for (const u of starterUsers) {
      await query(
        `INSERT INTO users (id, name, email, phone, role, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET password_hash = $6, role = $5`,
        [u.id, u.name, u.email, u.phone, u.role, u.password_hash]
      );
    }
    console.log('✓ Seeded starter system users: Admin, Store Manager, Delivery Partner, Customer.');

    // 2. Seed Delivery Zones
    await query(
      `INSERT INTO delivery_zones (name, center_lat, center_lng, radius_km, base_delivery_fee, free_delivery_threshold, min_order_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        starterZone.name,
        starterZone.center_lat,
        starterZone.center_lng,
        starterZone.radius_km,
        starterZone.base_delivery_fee,
        starterZone.free_delivery_threshold,
        starterZone.min_order_amount,
      ]
    );

    // 3. Seed Categories
    for (const cat of CATEGORIES_DATA) {
      await query(
        `INSERT INTO categories (id, name, description, image_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET name = $2, description = $3`,
        [cat.id, cat.name, cat.description, cat.image]
      );
    }

    // 4. Seed Stores
    for (const s of INITIAL_STORES) {
      await query(
        `INSERT INTO stores (id, name, type, category_name, address, latitude, longitude, phone, rating, delivery_time_minutes, min_order_amount, is_open, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET is_open = $12, rating = $9`,
        [
          s.id,
          s.name,
          s.type,
          s.categoryName,
          s.address,
          s.lat,
          s.lng,
          s.phone,
          s.rating,
          s.deliveryTimeMinutes,
          s.minOrderAmount,
          s.isOpen,
          s.image,
        ]
      );
    }

    // 5. Seed Products
    for (const p of INITIAL_PRODUCTS) {
      await query(
        `INSERT INTO products (id, store_id, category_id, name, description, price, original_price, discount_percent, unit, stock, is_prescription_required, image_url, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO UPDATE SET price = $6, stock = $10`,
        [
          p.id,
          p.storeId,
          p.categoryId,
          p.name,
          p.description,
          p.price,
          p.originalPrice,
          p.discountPercent,
          p.unit,
          p.stock,
          p.isPrescriptionRequired,
          p.image,
          p.tags,
        ]
      );
    }

    // 6. Seed Coupons
    for (const c of starterCoupons) {
      await query(
        `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (code) DO NOTHING`,
        [
          c.code,
          c.description,
          c.discount_type,
          c.discount_value,
          c.min_order_amount,
          c.max_discount_amount,
          c.usage_limit,
          c.end_date,
        ]
      );
    }

    console.log('✓ Database seed completed successfully!');
    return { success: true };
  } catch (err) {
    console.error('Seed execution error:', err);
    throw err;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
