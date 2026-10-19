const http = require('http');
const app = require('./server/app');
const config = require('./server/config');
const { initWebSocket } = require('./server/websocket');
const { seedDatabase } = require('./server/db/seedData');
const { db } = require('./server/db/database');

// 1. Ensure SQLite database is initialized and seeded
seedDatabase();

// 2. Create HTTP Server
const server = http.createServer(app);

// 3. Initialize Real-Time WebSocket Gateway
const wss = initWebSocket(server);

// 4. Start Server
server.listen(config.port, config.host, () => {
  const hostUrl = `http://localhost:${config.port}`;
  
  console.log('\n================================================================');
  console.log('  🚀 BEEGO — Virajpet Edition (Kodagu, Karnataka)');
  console.log('  100% Halal Food, Estate Coffee & Express Courier Server');
  console.log('================================================================');
  console.log(`  🌐 Website URL:         ${hostUrl}`);
  console.log(`  📊 Admin Dispatcher:    ${hostUrl}/admin`);
  console.log(`  📖 API Explorer & Docs: ${hostUrl}/api`);
  console.log(`  💓 Health & Metrics:    ${hostUrl}/api/health`);
  console.log(`  ⚡ Real-Time WebSocket: ws://localhost:${config.port}/ws`);
  console.log(`  🗄️  SQLite Database:     ${config.dbPath}`);
  console.log(`  🕒 Server Local Time:   ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log('================================================================\n');
});

// 5. Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

  // Close HTTP server
  server.close(() => {
    console.log('[Server] HTTP server stopped accepting connections.');

    // Close SQLite
    try {
      db.close();
      console.log('[Database] SQLite connection closed.');
    } catch (e) {
      console.error('[Database] Error closing SQLite:', e.message);
    }

    console.log('[Server] Shutdown complete. Goodbye!');
    process.exit(0);
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    console.error('[Server] Force exit: Shutdown timeout exceeded.');
    process.exit(1);
  }, 5000);
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = server;
