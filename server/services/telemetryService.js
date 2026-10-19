const { db } = require('../db/database');
const { broadcast } = require('../websocket');

// Curated GPS Waypoints across Virajpet hilly roads
const VIRAJPEE_ROUTE = [
  { lat: 12.2015, lng: 75.8034, area: 'Clock Tower Circle (Gadiyara Kambha)', speed: 0, progress: 0 },
  { lat: 12.2023, lng: 75.8040, area: 'Main Road (Near Town Police Station)', speed: 28, progress: 20 },
  { lat: 12.2038, lng: 75.8052, area: 'College Road (Near Kaveri Campus)', speed: 32, progress: 40 },
  { lat: 12.2048, lng: 75.8062, area: 'Kaveri Layout Crossing', speed: 30, progress: 60 },
  { lat: 12.2010, lng: 75.8025, area: 'Malabar Road (Near Meenupet Junction)', speed: 34, progress: 80 },
  { lat: 12.1985, lng: 75.8012, area: 'Destination (Customer Residence)', speed: 0, progress: 100 }
];

const activeSimulations = new Map();

/**
 * Start or advance a live tracking simulation for an order or courier
 */
function startOrderSimulation(orderNumber, { fastMode = false } = {}) {
  // If already running, do not duplicate
  if (activeSimulations.has(orderNumber)) {
    return;
  }

  let stepIndex = 0;
  const intervalMs = fastMode ? 3000 : 6000;

  console.log(`[Telemetry] Starting live Virajpet courier telemetry for Order #${orderNumber}`);

  const timer = setInterval(() => {
    if (stepIndex >= VIRAJPEE_ROUTE.length) {
      clearInterval(timer);
      activeSimulations.delete(orderNumber);

      // Final status: DELIVERED
      try {
        db.prepare(`
          UPDATE orders 
          SET status = 'DELIVERED', eta_minutes = 0, updated_at = datetime('now')
          WHERE order_number = ?
        `).run(orderNumber);

        broadcast(`order:${orderNumber}`, {
          type: 'order_status_update',
          orderNumber,
          status: 'DELIVERED',
          message: 'Order safely delivered to recipient in Virajpet!',
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('[Telemetry Error]', err.message);
      }
      return;
    }

    const currentWaypoint = VIRAJPEE_ROUTE[stepIndex];
    let status = 'ON_THE_WAY';
    let statusText = `In Transit (Area: ${currentWaypoint.area})`;

    if (stepIndex === 0) {
      status = 'PREPARING';
      statusText = 'Kitchen preparing your fresh halal meal';
    } else if (stepIndex === 1) {
      status = 'PICKED_UP';
      statusText = 'Rider Mohammed Suhail picked up package';
    } else if (stepIndex === VIRAJPEE_ROUTE.length - 1) {
      status = 'DELIVERED';
      statusText = 'Rider arrived at destination';
    }

    const eta = Math.max(1, Math.round(15 * (1 - currentWaypoint.progress / 100)));
    const battery = Math.max(70, Math.round(92 - (stepIndex * 2.5)));

    // Update DB
    try {
      db.prepare(`
        UPDATE orders 
        SET status = ?, rider_lat = ?, rider_lng = ?, eta_minutes = ?, updated_at = datetime('now')
        WHERE order_number = ?
      `).run(status, currentWaypoint.lat, currentWaypoint.lng, eta, orderNumber);

      // Log to telemetry logs
      db.prepare(`
        INSERT INTO telemetry_logs (reference_id, lat, lng, speed, battery, status_text)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(orderNumber, currentWaypoint.lat, currentWaypoint.lng, currentWaypoint.speed, battery, statusText);
    } catch (err) {
      console.error('[Telemetry DB update error]', err.message);
    }

    // Broadcast to specific order channel AND general feed
    const telemetryPayload = {
      type: 'telemetry_update',
      orderNumber,
      rider: {
        name: 'Mohammed Suhail',
        vehicle: 'TVS iQube Electric',
        lat: currentWaypoint.lat,
        lng: currentWaypoint.lng,
        speedKmh: currentWaypoint.speed,
        batteryPercent: battery,
        currentArea: currentWaypoint.area
      },
      status,
      statusText,
      progressPercent: currentWaypoint.progress,
      etaMinutes: eta,
      timestamp: new Date().toISOString()
    };

    broadcast(`order:${orderNumber}`, telemetryPayload);
    broadcast('live_telemetry_feed', telemetryPayload);

    stepIndex++;
  }, intervalMs);

  activeSimulations.set(orderNumber, timer);
}

function stopSimulation(orderNumber) {
  if (activeSimulations.has(orderNumber)) {
    clearInterval(activeSimulations.get(orderNumber));
    activeSimulations.delete(orderNumber);
    console.log(`[Telemetry] Stopped simulation for Order #${orderNumber}`);
  }
}

module.exports = {
  VIRAJPEE_ROUTE,
  startOrderSimulation,
  stopSimulation
};
