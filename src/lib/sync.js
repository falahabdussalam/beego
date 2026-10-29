/**
 * Real-time synchronization utility between Admin Dashboard and Customer Site.
 * Utilizes BroadcastChannel and localStorage events for instant updates across tabs/windows.
 */

const SYNC_CHANNEL_NAME = 'beego_catalog_sync';
const SYNC_STORAGE_KEY = 'beego_sync_event';

let broadcastChannel = null;

function getBroadcastChannel() {
  if (typeof window === 'undefined') return null;
  if (!broadcastChannel && typeof window.BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    } catch (e) {
      // Ignored
    }
  }
  return broadcastChannel;
}

/**
 * Broadcast an update event from Admin to any open Customer tabs
 */
export function broadcastSyncEvent(type, payload = {}) {
  if (typeof window === 'undefined') return;

  const eventData = {
    type,
    payload,
    timestamp: Date.now(),
  };

  // 1. BroadcastChannel API (instant cross-tab messaging)
  try {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage(eventData);
    }
  } catch (e) {
    // Fallback
  }

  // 2. Storage Event (fires across windows / tabs on the same origin)
  try {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(eventData));
  } catch (e) {
    // Ignored
  }
}

/**
 * Subscribe to sync events on Customer side
 * @param {Function} callback (eventData) => void
 * @returns {Function} cleanup unsubscribe function
 */
export function subscribeSyncEvents(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (e) => {
    if (e.data && typeof e.data === 'object') {
      callback(e.data);
    }
  };

  const handleStorage = (e) => {
    if (e.key === SYNC_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (err) {
        // Ignored
      }
    }
  };

  const channel = getBroadcastChannel();
  if (channel) {
    channel.addEventListener('message', handleMessage);
  }

  window.addEventListener('storage', handleStorage);

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

