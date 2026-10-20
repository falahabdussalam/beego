const assert = require('assert');
const http = require('http');
const app = require('../server/app');
const { seedDatabase } = require('../server/db/seedData');
const { db } = require('../server/db/database');

// Ensure seeded DB
seedDatabase();

const server = http.createServer(app);

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3999,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Starting BEEGO Backend Test Suite...\n');
  let passed = 0;
  let failed = 0;

  await new Promise(resolve => server.listen(3999, '127.0.0.1', resolve));

  async function test(name, fn) {
    process.stdout.write(`  ▶ ${name} ... `);
    try {
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log('❌ FAILED');
      console.error('    Error:', err.message);
      failed++;
    }
  }

  try {
    // 1. Health check
    await test('GET /api/health returns 200 and UP status', async () => {
      const res = await request('GET', '/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.status, 'UP');
      assert.strictEqual(res.body.healthy, true);
      assert.ok(res.body.database.records.merchants >= 8);
    });

    // 2. Merchants listing
    await test('GET /api/merchants returns active merchants with items', async () => {
      const res = await request('GET', '/api/merchants');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.length >= 8);
      assert.ok(res.body.data[0].items.length > 0);
    });

    // 3. Merchants category filter
    await test('GET /api/merchants?category=food filters food merchants', async () => {
      const res = await request('GET', '/api/merchants?category=food');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.length >= 2);
      for (const m of res.body.data) {
        assert.strictEqual(m.category, 'food');
      }
    });

    // 4. Single merchant detail
    await test('GET /api/merchants/m1 returns Al-Bait with categorizedMenu', async () => {
      const res = await request('GET', '/api/merchants/m1');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.id, 'm1');
      assert.strictEqual(res.body.data.name, 'Al-Bait Kodagu Halal Kitchen');
      assert.ok(res.body.data.items.length >= 4);
    });

    // 5. Categories
    await test('GET /api/merchants/categories returns category counts', async () => {
      const res = await request('GET', '/api/merchants/categories');
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.length >= 5);
      const foodCat = res.body.data.find(c => c.id === 'food');
      assert.ok(foodCat);
      assert.ok(foodCat.count >= 2);
    });

    // 6. Promo code validation
    await test('POST /api/promos/validate calculates 10% discount for BEEGO10', async () => {
      const res = await request('POST', '/api/promos/validate', {
        code: 'BEEGO10',
        subtotal: 500.0,
        deliveryFee: 25.0
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.valid, true);
      assert.strictEqual(res.body.data.discountAmount, 50.0);
    });

    // 9. Create Order
    let createdOrderNumber = null;
    await test('POST /api/orders places order and calculates totals accurately', async () => {
      const res = await request('POST', '/api/orders', {
        storeId: 'm1',
        customerName: 'Falah Abdulla',
        deliveryAddress: 'Clock Tower Circle, Virajpet',
        items: [
          { id: 'item_101', name: 'Coorg Halal Koli Curry with Soft Akki Oti (3 Pcs)', price: 260.00, qty: 1 },
          { id: 'item_102', name: 'Kodagu Halal Mutton Pepper Fry (Handi Roasted)', price: 380.00, qty: 1 }
        ],
        tip: 30.00,
        promoCode: 'BEEGO10',
        paymentMethod: 'UPI'
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.orderNumber.startsWith('BG-'));
      createdOrderNumber = res.body.data.orderNumber;

      // Subtotal = 260 + 380 = 640
      // 10% discount on 640 = 64
      // Delivery = 0 (Al-Bait is free delivery)
      // Service fee = 15
      // Tip = 30
      // Total = 640 + 0 + 15 + 30 - 64 = 621
      assert.strictEqual(res.body.data.financials.subtotal, 640);
      assert.strictEqual(res.body.data.financials.discount, 64);
      assert.strictEqual(res.body.data.financials.total, 621);
    });

    // 10. Fetch order by order number
    await test('GET /api/orders/:id retrieves order and timeline steps', async () => {
      assert.ok(createdOrderNumber);
      const res = await request('GET', `/api/orders/${createdOrderNumber}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.orderNumber, createdOrderNumber);
      assert.strictEqual(res.body.data.timeline.length, 4);
      assert.strictEqual(res.body.data.rider.name, 'Mohammed Suhail');
    });

    // 11. Update order status
    await test('PATCH /api/orders/:id/status updates status to ON_THE_WAY', async () => {
      assert.ok(createdOrderNumber);
      const res = await request('PATCH', `/api/orders/${createdOrderNumber}/status`, {
        status: 'ON_THE_WAY'
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.status, 'ON_THE_WAY');
    });

    // 12. User profile
    await test('GET /api/user/profile retrieves Falah Abdulla profile & addresses', async () => {
      const res = await request('GET', '/api/user/profile');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.name, 'Falah Abdulla');
      assert.ok(res.body.data.savedAddresses.length >= 3);
      assert.ok(res.body.data.walletBalance >= 0);
    });

    // 13. Wallet top-up
    await test('POST /api/user/wallet/topup credits wallet and creates ledger entry', async () => {
      const before = await request('GET', '/api/user/profile');
      const oldBal = before.body.data.walletBalance;

      const res = await request('POST', '/api/user/wallet/topup', {
        amount: 250.00,
        paymentMethod: 'UPI'
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.newBalance, oldBal + 250.00);
    });

    // 14. Add address
    let newAddressId = null;
    await test('POST /api/user/addresses saves custom address', async () => {
      const res = await request('POST', '/api/user/addresses', {
        title: 'New Plantation Bungalow',
        subtitle: 'Near Coffee Board, Virajpet',
        addressLine: 'Estate View Road, Virajpet 571218',
        preset: 'Home'
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.title, 'New Plantation Bungalow');
      newAddressId = res.body.data.id;
    });

    // 15. Security guard prevents accessing database file
    await test('GET /data/beego.db returns 404 blocked by security guard', async () => {
      const res = await request('GET', '/data/beego.db');
      assert.strictEqual(res.status, 404);
    });

    // 15. Delete address
    await test('DELETE /api/user/addresses/:id removes address', async () => {
      assert.ok(newAddressId);
      const res = await request('DELETE', `/api/user/addresses/${newAddressId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });

    // 18. Update profile (name, phone, avatar)
    await test('PATCH /api/user/profile updates user name, phone and avatar_url', async () => {
      const res = await request('PATCH', '/api/user/profile', {
        name: 'Falah Abdulla Kodagu',
        phone: '+91 98451 99999',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&h=180&q=80',
        location: 'College Road, Virajpet 571218'
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Falah Abdulla Kodagu');
      assert.strictEqual(res.body.data.phone, '+91 98451 99999');
      assert.strictEqual(res.body.data.avatarUrl, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&h=180&q=80');
      assert.strictEqual(res.body.data.location, 'College Road, Virajpet 571218');
    });

    // 19. Validate profile name
    await test('PATCH /api/user/profile rejects blank name', async () => {
      const res = await request('PATCH', '/api/user/profile', {
        name: '   '
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.error, 'InvalidName');
    });

    // 17. Admin Stats
    await test('GET /api/admin/stats returns aggregate metrics', async () => {
      const res = await request('GET', '/api/admin/stats');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.totalMerchants >= 8);
      assert.ok(res.body.data.totalItems >= 20);
      assert.ok(res.body.data.inStockRate >= 0);
    });

    // 18. Admin Items Listing
    await test('GET /api/admin/items returns items with merchant details', async () => {
      const res = await request('GET', '/api/admin/items');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.length >= 20);
      assert.ok(res.body.data[0].merchant_name);
    });

    // 19. Admin Add Product
    let createdItemId = null;
    await test('POST /api/admin/items adds a new dish with category & price', async () => {
      const res = await request('POST', '/api/admin/items', {
        merchant_id: 'm1',
        name: 'Coorg Bamboo Shoot Stew (Baimbale)',
        price: 195.00,
        category: 'Kodagu Curries',
        description: 'Tender monsoon bamboo shoots simmered in spiced coconut gravy.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        is_available: 1
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Coorg Bamboo Shoot Stew (Baimbale)');
      assert.strictEqual(res.body.data.price, 195.00);
      assert.strictEqual(res.body.data.category, 'Kodagu Curries');
      createdItemId = res.body.data.id;
    });

    // 20. Admin Edit Product
    await test('PUT /api/admin/items/:id updates price and category', async () => {
      assert.ok(createdItemId);
      const res = await request('PUT', `/api/admin/items/${createdItemId}`, {
        price: 210.00,
        category: 'Estate Specials'
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.price, 210.00);
      assert.strictEqual(res.body.data.category, 'Estate Specials');
    });

    // 21. Admin Toggle Stock Availability
    await test('PATCH /api/admin/items/:id/availability toggles stock', async () => {
      assert.ok(createdItemId);
      const res = await request('PATCH', `/api/admin/items/${createdItemId}/availability`, {
        is_available: 0
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.is_available, 0);
    });

    // 22. Admin Delete Product
    await test('DELETE /api/admin/items/:id removes product from catalog', async () => {
      assert.ok(createdItemId);
      const res = await request('DELETE', `/api/admin/items/${createdItemId}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);

      // Verify deletion
      const checkRes = await request('GET', `/api/admin/items/${createdItemId}`);
      assert.strictEqual(checkRes.status, 404);
    });

    // 23. Admin Merchants Management
    await test('POST /api/admin/merchants registers a new cafe/restaurant', async () => {
      const res = await request('POST', '/api/admin/merchants', {
        name: 'Coorg Artisan Honey & Kaapi Cafe',
        category: 'beverages',
        cuisine: 'Single Origin Espresso & Wildflower Infusions',
        delivery_time: '15-20 min',
        delivery_fee: 15.00,
        min_order: 80.00,
        location: 'Madikeri Road, Virajpet'
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.name, 'Coorg Artisan Honey & Kaapi Cafe');

      // Clean up test merchant
      const testId = res.body.data.id;
      const delRes = await request('DELETE', `/api/admin/merchants/${testId}`);
      assert.strictEqual(delRes.status, 200);
    });

  } finally {
    // Reset test artifacts to pristine clean database state
    try {
      db.prepare('DELETE FROM orders').run();
      db.prepare('DELETE FROM wallet_transactions').run();
      db.prepare("UPDATE users SET name = 'Falah Abdulla', phone = '+91 98451 23456', email = 'falah.kodagu@gmail.com', avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80', location = 'Virajpet Town, Kodagu 571218', wallet_balance = 0.00 WHERE id = 'user_falah'").run();
    } catch (e) {}

    server.close();
  }

  console.log(`\n-------------------------------------------------`);
  console.log(`  Tests completed: ${passed} passed, ${failed} failed`);
  console.log(`-------------------------------------------------\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
