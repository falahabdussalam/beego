import { query, getMemoryStore } from '../db/client.js';

export class NotificationAdapter {
  async sendOrderNotification({ orderId, status, recipient, message }) {
    throw new Error('sendOrderNotification must be implemented.');
  }
}

/**
 * In-App & Local Store Notification Provider (Default & Fallback)
 */
export class InAppNotificationProvider extends NotificationAdapter {
  async sendOrderNotification({ orderId, status, recipient, message }) {
    const notificationId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const record = {
      id: notificationId,
      order_id: orderId,
      status,
      recipient,
      message,
      read: false,
      created_at: timestamp,
    };

    try {
      await query(
        `INSERT INTO notification_records (id, order_id, status, recipient, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [record.id, record.order_id, record.status, record.recipient, record.message, record.created_at]
      );
    } catch (e) {
      // Memory store fallback
      const mem = getMemoryStore();
      if (!mem.notifications) mem.notifications = [];
      mem.notifications.unshift(record);
    }

    console.log(`[Notification:In-App] Order ${orderId} (${status}): "${message}" to ${recipient}`);

    return {
      success: true,
      channel: 'inapp',
      notificationId,
      note: 'In-app notification saved. External SMS/WhatsApp gateways will activate when credentials are provided in .env.local.',
    };
  }
}

/**
 * Get active notification adapter
 */
export function getNotificationAdapter() {
  return new InAppNotificationProvider();
}

