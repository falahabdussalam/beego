const { WebSocketServer } = require('ws');

let wss = null;
const subscriptions = new Map(); // channelName -> Set of ws clients

/**
 * Initialize WebSocket Server attached to HTTP server
 */
function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    ws.isAlive = true;
    ws.subscriptions = new Set();

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          return;
        }

        if (data.type === 'subscribe' && data.channel) {
          const channel = data.channel;
          ws.subscriptions.add(channel);

          if (!subscriptions.has(channel)) {
            subscriptions.set(channel, new Set());
          }
          subscriptions.get(channel).add(ws);

          ws.send(JSON.stringify({
            type: 'subscribed',
            channel,
            message: `Subscribed to live updates on ${channel}`
          }));
        }

        if (data.type === 'unsubscribe' && data.channel) {
          const channel = data.channel;
          ws.subscriptions.delete(channel);
          if (subscriptions.has(channel)) {
            subscriptions.get(channel).delete(ws);
          }
        }
      } catch (err) {
        console.error('[WS Message Error]', err.message);
      }
    });

    ws.on('close', () => {
      // Clean up subscriptions
      for (const channel of ws.subscriptions) {
        if (subscriptions.has(channel)) {
          subscriptions.get(channel).delete(ws);
          if (subscriptions.get(channel).size === 0) {
            subscriptions.delete(channel);
          }
        }
      }
    });

    // Send welcome
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to BEEGO Virajpet Real-Time Gateway',
      serverTime: new Date().toISOString()
    }));
  });

  // Heartbeat interval to clean up dead sockets
  const interval = setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('[WebSocket] Real-time gateway initialized at /ws');
  return wss;
}

/**
 * Broadcast message to all connected clients or specific channel subscribers
 */
function broadcast(channelOrData, maybeData) {
  if (!wss) return;

  let channel = null;
  let payload = null;

  if (typeof channelOrData === 'string') {
    channel = channelOrData;
    payload = maybeData;
  } else {
    payload = channelOrData;
  }

  const messageStr = JSON.stringify(payload);

  if (channel && subscriptions.has(channel)) {
    // Send to subscribers of this channel
    for (const client of subscriptions.get(channel)) {
      if (client.readyState === 1) { // OPEN
        client.send(messageStr);
      }
    }
  } else {
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(messageStr);
      }
    });
  }
}

function getConnectedClientsCount() {
  return wss ? wss.clients.size : 0;
}

module.exports = {
  initWebSocket,
  broadcast,
  getConnectedClientsCount
};
