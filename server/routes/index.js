const express = require('express');
const router = express.Router();

const merchantRoutes = require('./merchantRoutes');
const orderRoutes = require('./orderRoutes');
const userRoutes = require('./userRoutes');
const promoRoutes = require('./promoRoutes');
const healthRoutes = require('./healthRoutes');
const adminRoutes = require('./adminRoutes');

// Mount Sub-routers
router.use('/health', healthRoutes);
router.use('/merchants', merchantRoutes);
router.use('/orders', orderRoutes);
router.use('/user', userRoutes);
router.use('/promos', promoRoutes);
router.use('/admin', adminRoutes);

// Interactive API Explorer & Live Documentation UI
router.get('/', (req, res) => {
  // If client requested JSON, return endpoint catalog
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      name: 'BEEGO Virajpet REST API',
      version: '1.0.0',
      description: 'API for 100% Halal Food & Estate Coffee Delivery',
      endpoints: {
        health: '/api/health',
        merchants: '/api/merchants',
        categories: '/api/merchants/categories',
        orders: '/api/orders',
        userProfile: '/api/user/profile',
        userPreferences: '/api/user/preferences',
        walletTopup: '/api/user/wallet/topup',
        walletTransactions: '/api/user/wallet/transactions',
        promoValidate: '/api/promos/validate',
        adminStats: '/api/admin/stats',
        adminItems: '/api/admin/items',
        adminMerchants: '/api/admin/merchants',
        websocket: '/ws'
      }
    });
  }

  // Otherwise render rich Interactive API Documentation Portal
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BEEGO Virajpet — API Documentation & Explorer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #FAF7F2;
      --card-bg: #FFFFFF;
      --maroon: #520D18;
      --maroon-dark: #3D0911;
      --gold: #C08D38;
      --green: #236B36;
      --text-main: #221614;
      --text-muted: #6E5E5A;
      --border: #E5DACB;
      --code-bg: #1A1312;
      --code-text: #E6E1DC;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Bricolage Grotesque', sans-serif;
      background: var(--bg);
      color: var(--text-main);
      line-height: 1.5;
      padding: 0;
    }
    header {
      background: var(--maroon);
      color: #FAF7F2;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(82, 13, 24, 0.15);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .badge {
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 12px;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .badge-gold {
      background: var(--gold);
      color: #221614;
    }
    .container {
      max-width: 1100px;
      margin: 32px auto;
      padding: 0 20px;
    }
    .nav-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .nav-tabs a {
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text-main);
      padding: 10px 18px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    .nav-tabs a:hover, .nav-tabs a.active {
      background: var(--maroon);
      color: white;
      border-color: var(--maroon);
    }
    .grid {
      display: grid;
      gap: 20px;
    }
    .endpoint-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .endpoint-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1px solid #F0E8DC;
      cursor: pointer;
      user-select: none;
    }
    .method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .method-GET { background: #E8F5E9; color: #2E7D32; }
    .method-POST { background: #E3F2FD; color: #1565C0; }
    .method-PATCH { background: #FFF3E0; color: #E65100; }
    .path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    }
    .desc {
      color: var(--text-muted);
      font-size: 13px;
    }
    .endpoint-body {
      padding: 20px;
      background: #FDFAF6;
    }
    .code-block {
      background: var(--code-bg);
      color: var(--code-text);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      padding: 14px;
      border-radius: 8px;
      overflow-x: auto;
      margin-top: 10px;
      max-height: 250px;
    }
    .btn-test {
      background: var(--maroon);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-test:hover {
      background: var(--maroon-dark);
    }
    .live-result {
      margin-top: 12px;
      display: none;
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <h2 style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">BEEGO</h2>
      <span class="badge">VIRAJPEE SERVER API</span>
      <span class="badge badge-gold">100% Halal Platform</span>
    </div>
    <div>
      <a href="/" style="color: white; text-decoration: none; margin-right: 18px; font-weight: 600;">← Open Website</a>
      <a href="/admin" style="background: white; color: var(--maroon); padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: 700;">Admin Dashboard →</a>
    </div>
  </header>

  <div class="container">
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 28px; margin-bottom: 8px;">Virajpet Engine REST Endpoints & Real-time Telemetry</h1>
      <p style="color: var(--text-muted);">
        Interactive documentation for BEEGO Virajpet Edition. All financial operations in Indian Rupees (INR ₹),
        live telemetry simulation via WebSocket, and local SQLite ACID persistence.
      </p>
    </div>

    <div class="grid">
      <!-- Endpoint 1: Health -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-GET">GET</span>
          <span class="path">/api/health</span>
          <span class="desc">System health, SQLite tables count, memory & uptime</span>
          <button class="btn-test" onclick="runTest('GET', '/api/health', null, 'res-health')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <p style="font-size: 13px; color: var(--text-muted);">Returns real-time server health and database status.</p>
          <div class="live-result" id="res-health"></div>
        </div>
      </div>

      <!-- Endpoint 2: Merchants List -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-GET">GET</span>
          <span class="path">/api/merchants</span>
          <span class="desc">List all 8 Virajpet merchants & halal offerings</span>
          <button class="btn-test" onclick="runTest('GET', '/api/merchants?category=food', null, 'res-merchants')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <p style="font-size: 13px; color: var(--text-muted);">Filters: <code>category</code> (food, grocery, medicine, beverages, desserts), <code>search</code>, <code>sort</code>.</p>
          <div class="live-result" id="res-merchants"></div>
        </div>
      </div>

      <!-- Endpoint 3: Categories -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-GET">GET</span>
          <span class="path">/api/merchants/categories</span>
          <span class="desc">Browse categories with item counts and descriptions</span>
          <button class="btn-test" onclick="runTest('GET', '/api/merchants/categories', null, 'res-categories')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <div class="live-result" id="res-categories"></div>
        </div>
      </div>

      <!-- Endpoint 4: Create Order -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-POST">POST</span>
          <span class="path">/api/orders</span>
          <span class="desc">Submit order, calculate totals & trigger rider telemetry</span>
          <button class="btn-test" onclick="runTest('POST', '/api/orders', {
            storeId: 'm1',
            customerName: 'Falah Abdulla',
            customerPhone: '+91 98452 71098',
            deliveryAddress: 'Clock Tower Circle, Virajpet',
            items: [
              { id: 'item_101', name: 'Coorg Halal Koli Curry with Soft Akki Oti (3 Pcs)', price: 260.00, qty: 1 },
              { id: 'item_102', name: 'Kodagu Halal Mutton Pepper Fry (Handi Roasted)', price: 380.00, qty: 1 }
            ],
            tip: 30.00,
            promoCode: 'BEEGO10',
            paymentMethod: 'UPI'
          }, 'res-orders-post')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <p style="font-size: 13px; color: var(--text-muted);">Validates item prices, verifies promo codes, deducts from wallet if requested, generates order ID, and starts live GPS rider simulation.</p>
          <div class="live-result" id="res-orders-post"></div>
        </div>
      </div>


      <!-- Endpoint 7: User Profile -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-GET">GET</span>
          <span class="path">/api/user/profile</span>
          <span class="desc">Retrieve user details, wallet balance & saved addresses</span>
          <button class="btn-test" onclick="runTest('GET', '/api/user/profile', null, 'res-user-profile')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <div class="live-result" id="res-user-profile"></div>
        </div>
      </div>

      <!-- Endpoint 8: Wallet Top-Up -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-POST">POST</span>
          <span class="path">/api/user/wallet/topup</span>
          <span class="desc">Credit balance with UPI transaction logging</span>
          <button class="btn-test" onclick="runTest('POST', '/api/user/wallet/topup', {
            amount: 200.00,
            paymentMethod: 'UPI',
            upiId: 'falah@okaxis'
          }, 'res-wallet-topup')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <div class="live-result" id="res-wallet-topup"></div>
        </div>
      </div>

      <!-- Endpoint 9: Promo Code Validation -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method method-POST">POST</span>
          <span class="path">/api/promos/validate</span>
          <span class="desc">Validate coupon code (BEEGO10, BEEGOFIRST, FREEDEL)</span>
          <button class="btn-test" onclick="runTest('POST', '/api/promos/validate', {
            code: 'BEEGO10',
            subtotal: 500.00,
            deliveryFee: 25.00
          }, 'res-promos')">Test Endpoint</button>
        </div>
        <div class="endpoint-body">
          <div class="live-result" id="res-promos"></div>
        </div>
      </div>

      <!-- Endpoint 10: WebSocket -->
      <div class="endpoint-card">
        <div class="endpoint-header">
          <span class="method" style="background: #EDE7F6; color: #512DA8;">WS</span>
          <span class="path">/ws</span>
          <span class="desc">Real-time WebSocket Gateway for live telemetry & order tracking</span>
          <button class="btn-test" onclick="testWebSocket()">Connect & Listen</button>
        </div>
        <div class="endpoint-body">
          <p style="font-size: 13px; color: var(--text-muted);">
            Clients send <code>{"type": "subscribe", "channel": "order:BG-9482"}</code> to receive live 1Hz telemetry updates
            (GPS coordinates, scooter speed, battery %, and street location in Virajpet).
          </p>
          <div class="live-result" id="res-ws"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function runTest(method, url, body, resultId) {
      const el = document.getElementById(resultId);
      el.style.display = 'block';
      el.innerHTML = '<span style="color: #888;">Executing request...</span>';

      try {
        const options = {
          method,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        };
        if (body && method !== 'GET') {
          options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        const json = await res.json();

        el.innerHTML = '<div class="code-block"><pre>' + JSON.stringify(json, null, 2) + '</pre></div>';
      } catch (err) {
        el.innerHTML = '<div style="color: red; padding: 10px;">Error: ' + err.message + '</div>';
      }
    }

    function testWebSocket() {
      const el = document.getElementById('res-ws');
      el.style.display = 'block';
      el.innerHTML = '<span style="color: #888;">Connecting to ws://' + window.location.host + '/ws ...</span>';

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(wsProtocol + '//' + window.location.host + '/ws');

      ws.onopen = () => {
        el.innerHTML = '<span style="color: green;">✓ Connected! Subscribing to live order channel...</span>';
        ws.send(JSON.stringify({ type: 'subscribe', channel: 'order:BG-9482' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          el.innerHTML = '<div class="code-block"><pre>' + JSON.stringify(data, null, 2) + '</pre></div>';
        } catch (e) {
          el.innerHTML = '<div>' + event.data + '</div>';
        }
      };

      ws.onerror = (err) => {
        el.innerHTML = '<span style="color: red;">WebSocket error occurred.</span>';
      };
    }
  </script>
</body>
</html>
  `);
});

module.exports = router;
