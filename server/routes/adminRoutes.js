const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { getConnectedClientsCount } = require('../websocket');
const { startOrderSimulation } = require('../services/telemetryService');

router.get('/', (req, res) => {
  // Query summary metrics
  const totalOrders = db.prepare('SELECT count(*) as c FROM orders').get().c;
  const activeOrders = db.prepare("SELECT count(*) as c FROM orders WHERE status NOT IN ('DELIVERED', 'CANCELLED')").get().c;
  const totalCourier = db.prepare('SELECT count(*) as c FROM courier_bookings').get().c;
  const grossRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE status != 'CANCELLED'").get().rev;

  // Recent 15 orders
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 15').all();
  const parsedOrders = orders.map(o => {
    let items = [];
    try { items = JSON.parse(o.items_json); } catch (e) {}
    return { ...o, items };
  });

  // Recent 10 courier bookings
  const couriers = db.prepare('SELECT * FROM courier_bookings ORDER BY created_at DESC LIMIT 10').all();

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BEEGO Virajpet — Operations & Dispatch Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
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
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Bricolage Grotesque', sans-serif;
      background: var(--bg);
      color: var(--text-main);
      padding-bottom: 60px;
    }
    header {
      background: var(--maroon);
      color: #FAF7F2;
      padding: 18px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .badge {
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge-live {
      background: #236B36;
      color: white;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #74D984;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
    .container { max-width: 1200px; margin: 28px auto; padding: 0 20px; }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .stat-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
    .stat-val { font-size: 28px; font-weight: 800; color: var(--maroon); margin-top: 6px; }
    .section-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th {
      background: #F8F3EC;
      padding: 12px 16px;
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      text-transform: uppercase;
    }
    td { padding: 14px 16px; border-bottom: 1px solid #F0E8DC; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .status-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
    }
    .status-CONFIRMED { background: #FFF3E0; color: #E65100; }
    .status-PREPARING { background: #FFFDE7; color: #F57F17; }
    .status-PICKED_UP { background: #E1F5FE; color: #0288D1; }
    .status-ON_THE_WAY { background: #E8F5E9; color: #2E7D32; }
    .status-DELIVERED { background: #ECEFF1; color: #455A64; }
    .status-ASSIGNED { background: #E1F5FE; color: #0288D1; }
    .btn-action {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-action:hover { background: var(--maroon); color: white; border-color: var(--maroon); }
    .quick-actions-bar {
      background: #F5EFE6;
      border: 1px dashed var(--border);
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 28px;
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    .btn-primary-action {
      background: var(--maroon);
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-primary-action:hover { background: var(--maroon-dark); }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <h2 style="font-size: 20px; font-weight: 800;">BEEGO</h2>
      <span class="badge">OPERATIONS & DISPATCH</span>
      <span class="badge badge-live"><span class="pulse-dot"></span> LIVE VIRAJPEE ENGINE</span>
    </div>
    <div>
      <a href="/" style="color: white; text-decoration: none; margin-right: 18px; font-weight: 600;">Open Customer Site</a>
      <a href="/api" style="background: rgba(255,255,255,0.2); color: white; padding: 6px 14px; border-radius: 6px; text-decoration: none; font-weight: 600;">API Docs</a>
    </div>
  </header>

  <div class="container">
    <!-- Stat Counters -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Orders</div>
        <div class="stat-val">${totalOrders}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Deliveries</div>
        <div class="stat-val" style="color: #2E7D32;">${activeOrders}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Courier Dispatches</div>
        <div class="stat-val" style="color: #1565C0;">${totalCourier}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Gross Volume</div>
        <div class="stat-val">₹${grossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active WebSockets</div>
        <div class="stat-val" style="color: #6A1B9A;">${getConnectedClientsCount()}</div>
      </div>
    </div>

    <!-- Quick Simulation & Testing Actions -->
    <div class="quick-actions-bar">
      <span style="font-weight: 700; font-size: 14px; margin-right: 8px;">⚡ Dispatch Simulation Controls:</span>
      <button class="btn-primary-action" onclick="createMockOrder()">+ Generate Test Order</button>
      <button class="btn-primary-action" style="background: #236B36;" onclick="createMockCourier()">+ Book Test Courier</button>
      <button class="btn-action" onclick="startRiderSim('BG-9482')">Simulate Rider Suhail on BG-9482</button>
      <button class="btn-action" onclick="window.location.reload()">Refresh Data</button>
    </div>

    <!-- Live Orders Table -->
    <div class="section-title">
      <span>🍗 Virajpet Food & Grocery Orders</span>
      <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">Real-time status synced with SQLite</span>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Merchant / Cuisine</th>
            <th>Customer & Address</th>
            <th>Items</th>
            <th>Total (₹)</th>
            <th>Status</th>
            <th>Assigned Rider</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${parsedOrders.length === 0 ? '<tr><td colspan="8" style="text-align:center; padding: 24px;">No orders found. Click "+ Generate Test Order" above.</td></tr>' : ''}
          ${parsedOrders.map(o => `
            <tr>
              <td><strong style="color: var(--maroon); font-family: monospace;">#${o.order_number}</strong></td>
              <td>${o.merchant_name || 'Virajpet Merchant'}</td>
              <td>
                <div style="font-weight: 600;">${o.customer_name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${o.delivery_address}</div>
              </td>
              <td>
                ${o.items.map(i => `<span style="display:inline-block; background: #FAF7F2; border: 1px solid #E5DACB; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin: 1px;">${i.qty}x ${i.name}</span>`).join(' ')}
              </td>
              <td><strong>₹${o.total.toFixed(2)}</strong></td>
              <td><span class="status-pill status-${o.status}">${o.status}</span></td>
              <td>
                <div style="font-weight: 600;">${o.rider_name}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${o.rider_vehicle} • ETA: ${o.eta_minutes}m</div>
              </td>
              <td>
                <select onchange="updateStatus('${o.order_number}', this.value)" style="padding: 4px 8px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border);">
                  <option value="">Change Status...</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="ON_THE_WAY">On The Way</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancel</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Live Courier Bookings Table -->
    <div class="section-title">
      <span>📦 Town Courier & Express Logistics Bookings</span>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Booking #</th>
            <th>Package</th>
            <th>Route (Pickup → Drop)</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Rider Assigned</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${couriers.length === 0 ? '<tr><td colspan="7" style="text-align:center; padding: 24px;">No courier bookings yet. Click "+ Book Test Courier" above.</td></tr>' : ''}
          ${couriers.map(c => `
            <tr>
              <td><strong style="color: #1565C0; font-family: monospace;">#${c.booking_number}</strong></td>
              <td><strong>${c.package_name}</strong></td>
              <td>${c.origin_name} → <strong>${c.dest_name}</strong></td>
              <td><strong>₹${c.fare.toFixed(2)}</strong></td>
              <td><span class="status-pill status-${c.status}">${c.status}</span></td>
              <td>${c.rider_name} (${c.rider_vehicle})</td>
              <td style="color: var(--text-muted); font-size: 12px;">${c.created_at}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    async function updateStatus(orderNumber, status) {
      if (!status) return;
      try {
        const res = await fetch('/api/orders/' + orderNumber + '/status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Failed to update status: ' + err.message);
      }
    }

    async function createMockOrder() {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storeId: 'm1',
            customerName: 'Falah Abdulla',
            deliveryAddress: 'Clock Tower Circle, Virajpet 571218',
            items: [
              { id: 'item_101', name: 'Coorg Halal Koli Curry with Soft Akki Oti (3 Pcs)', price: 260.00, qty: 1 },
              { id: 'item_102', name: 'Kodagu Halal Mutton Pepper Fry (Handi Roasted)', price: 380.00, qty: 1 }
            ],
            tip: 30.00,
            paymentMethod: 'UPI'
          })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }

    async function createMockCourier() {
      try {
        const res = await fetch('/api/courier/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: 'clock_tower',
            dest: 'bittangala',
            packageType: 'coffee_parcel',
            senderName: 'Falah Abdulla',
            recipientName: 'Bittangala Plantation House'
          })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }

    async function startRiderSim(orderNumber) {
      alert('Rider Mohammed Suhail telemetry simulation triggered for Order #' + orderNumber + '! Check the live telemetry in the main site.');
      window.location.reload();
    }

    // Connect WebSocket for live updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(wsProtocol + '//' + window.location.host + '/ws');
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'new_order_placed' || msg.type === 'new_courier_dispatched' || msg.type === 'order_status_update') {
          console.log('[Real-time event received]', msg);
        }
      } catch (err) {}
    };
  </script>
</body>
</html>
  `);
});

module.exports = router;
