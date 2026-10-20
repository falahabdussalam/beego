const os = require('os');
const { db } = require('../db/database');
const { getConnectedClientsCount } = require('../websocket');
const config = require('../config');

/**
 * Health & Diagnostics Controller
 */
const healthController = {
  getHealth: (req, res) => {
    try {
      const startTime = process.uptime();
      const uptimeFormatted = formatUptime(startTime);

      // Query database counts
      const counts = {
        merchants: db.prepare('SELECT count(*) as c FROM merchants').get().c,
        menuItems: db.prepare('SELECT count(*) as c FROM menu_items').get().c,
        orders: db.prepare('SELECT count(*) as c FROM orders').get().c,
        users: db.prepare('SELECT count(*) as c FROM users').get().c
      };

      const mem = process.memoryUsage();

      res.json({
        status: 'UP',
        healthy: true,
        service: config.app.name,
        location: config.app.location,
        version: config.app.version,
        timestamp: new Date().toISOString(),
        uptime: uptimeFormatted,
        uptimeSeconds: Math.floor(startTime),
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          memoryUsageMb: {
            rss: Math.round(mem.rss / 1024 / 1024),
            heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
            heapUsed: Math.round(mem.heapUsed / 1024 / 1024)
          }
        },
        database: {
          type: 'SQLite3 (better-sqlite3)',
          mode: 'WAL (Write-Ahead Logging)',
          connected: true,
          records: counts
        },
        websocket: {
          activeConnections: getConnectedClientsCount(),
          endpoint: '/ws'
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'DOWN',
        healthy: false,
        error: err.message
      });
    }
  }
};

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? d + 'd ' : ''}${h}h ${m}m ${s}s`;
}

module.exports = healthController;
