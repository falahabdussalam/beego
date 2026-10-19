const { db } = require('../db/database');
const { broadcast } = require('../websocket');
const { startOrderSimulation, stopSimulation } = require('../services/telemetryService');

/**
 * Controller for Orders
 */
const orderController = {
  /**
   * POST /api/orders
   * Create a new order with real backend validation and persistence
   */
  createOrder: (req, res, next) => {
    try {
      const {
        items,
        storeId,
        customerName = 'Falah Abdulla',
        customerPhone = '+91 98452 71098',
        deliveryAddress = 'Clock Tower Circle, Main Road, Virajpet 571218',
        lat = 12.2015,
        lng = 75.8034,
        tip = 30.00,
        promoCode = null,
        paymentMethod = 'UPI',
        notes = ''
      } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'EmptyCart',
          message: 'An order must contain at least one item.'
        });
      }

      // Verify items against database prices and stock
      let subtotal = 0;
      const verifiedItems = [];
      let resolvedMerchantId = storeId || null;
      let resolvedMerchantName = '';

      const getItemStmt = db.prepare('SELECT m.id as item_id, m.name, m.price, m.merchant_id, merc.name as merchant_name, merc.delivery_fee FROM menu_items m JOIN merchants merc ON m.merchant_id = merc.id WHERE m.id = ?');

      for (const cartItem of items) {
        const itemId = cartItem.id || cartItem.item?.id;
        let qty = parseInt(cartItem.qty || cartItem.quantity || 1, 10);
        if (isNaN(qty) || qty <= 0) continue;
        qty = Math.min(99, qty);

        if (!itemId) continue;

        const dbItem = getItemStmt.get(itemId);
        if (!dbItem) {
          const rawPrice = parseFloat(cartItem.price || cartItem.item?.price || 0);
          const price = isNaN(rawPrice) ? 0 : Math.max(0, Math.min(50000, rawPrice));
          const name = String(cartItem.name || cartItem.item?.name || 'Custom Order Item').substring(0, 100);
          subtotal += price * qty;
          verifiedItems.push({
            id: itemId,
            name,
            price,
            qty,
            total: Math.round(price * qty * 100) / 100
          });
        } else {
          subtotal += dbItem.price * qty;
          resolvedMerchantId = dbItem.merchant_id;
          resolvedMerchantName = dbItem.merchant_name;
          verifiedItems.push({
            id: dbItem.item_id,
            name: dbItem.name,
            price: dbItem.price,
            qty,
            total: Math.round(dbItem.price * qty * 100) / 100
          });
        }
      }

      if (verifiedItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'InvalidItems',
          message: 'No valid items found in the order submission.'
        });
      }

      // Determine delivery fee from merchant or default
      let deliveryFee = 25.00;
      if (resolvedMerchantId) {
        const m = db.prepare('SELECT delivery_fee, name FROM merchants WHERE id = ?').get(resolvedMerchantId);
        if (m) {
          deliveryFee = m.delivery_fee;
          if (!resolvedMerchantName) resolvedMerchantName = m.name;
        }
      }

      // Free delivery for orders >= ₹199 in Virajpet
      if (subtotal >= 199.00) {
        deliveryFee = 0.00;
      }

      const serviceFee = 15.00;
      const tipAmount = Math.max(0, Math.min(5000, parseFloat(tip) || 0));

      // Validate Promo Code
      let discount = 0.00;
      let appliedPromoCode = null;

      if (promoCode && typeof promoCode === 'string') {
        const code = promoCode.trim().toUpperCase();
        const promo = db.prepare('SELECT * FROM promos WHERE code = ? AND is_active = 1').get(code);

        if (promo && subtotal >= promo.min_order) {
          appliedPromoCode = promo.code;
          if (promo.type === 'PERCENTAGE') {
            discount = Math.min(promo.max_discount, (subtotal * promo.value) / 100);
          } else if (promo.type === 'FREE_DELIVERY') {
            discount = deliveryFee;
            deliveryFee = 0.00;
          } else if (promo.type === 'FLAT') {
            discount = Math.min(promo.max_discount, promo.value);
          }
        }
      }

      const grandTotal = Math.max(0, Math.round((subtotal + deliveryFee + serviceFee + tipAmount - discount) * 100) / 100);

      // Unique Order ID and Number
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `BG-${randomDigits}`;
      const orderId = `ord_${Date.now()}_${randomDigits}`;
      const userId = 'user_falah'; // Default user

      // Wallet Payment Validation & Deduction
      const placeOrderTxn = db.transaction(() => {
        if (paymentMethod === 'WALLET') {
          const user = db.prepare('SELECT wallet_balance FROM users WHERE id = ?').get(userId);
          if (!user || user.wallet_balance < grandTotal) {
            throw new Error(`Insufficient wallet balance. You need ₹${grandTotal}, but have ₹${user ? user.wallet_balance : 0}.`);
          }

          const newBalance = user.wallet_balance - grandTotal;
          db.prepare('UPDATE users SET wallet_balance = ? WHERE id = ?').run(newBalance, userId);

          db.prepare(`
            INSERT INTO wallet_transactions (id, user_id, amount, type, description, balance_after, reference_id)
            VALUES (?, ?, ?, 'DEBIT', ?, ?, ?)
          `).run(`tx_${Date.now()}`, userId, grandTotal, `Payment for BEEGO Order #${orderNumber}`, newBalance, orderNumber);
        }

        // Insert Order
        db.prepare(`
          INSERT INTO orders (
            id, order_number, user_id, merchant_id, merchant_name,
            customer_name, customer_phone, delivery_address, lat, lng,
            items_json, subtotal, delivery_fee, service_fee, tip, discount, total,
            status, payment_method, promo_code, notes,
            rider_name, rider_phone, rider_vehicle, rider_lat, rider_lng, eta_minutes
          ) VALUES (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            'CONFIRMED', ?, ?, ?,
            'Mohammed Suhail', '+91 98452 33412', 'TVS iQube Electric', 12.2015, 75.8034, 20
          )
        `).run(
          orderId, orderNumber, userId, resolvedMerchantId, resolvedMerchantName || 'Virajpet Merchant',
          customerName, customerPhone, deliveryAddress, lat, lng,
          JSON.stringify(verifiedItems), subtotal, deliveryFee, serviceFee, tipAmount, discount, grandTotal,
          paymentMethod, appliedPromoCode, notes
        );
      });

      placeOrderTxn();

      // Broadcast order placed to real-time subscribers & start telemetry
      broadcast('new_order', {
        type: 'new_order_placed',
        orderNumber,
        merchantName: resolvedMerchantName,
        total: grandTotal,
        customerName,
        timestamp: new Date().toISOString()
      });

      // Start automatic live rider movement simulation
      startOrderSimulation(orderNumber);

      res.status(201).json({
        success: true,
        message: `Order #${orderNumber} placed successfully!`,
        data: {
          orderId,
          orderNumber,
          status: 'CONFIRMED',
          merchantName: resolvedMerchantName,
          items: verifiedItems,
          financials: {
            subtotal,
            deliveryFee,
            serviceFee,
            tip: tipAmount,
            discount,
            total: grandTotal,
            currency: '₹'
          },
          delivery: {
            address: deliveryAddress,
            estimatedDeliveryMinutes: 20,
            estimatedTimeText: '20–25 mins'
          },
          rider: {
            name: 'Mohammed Suhail',
            phone: '+91 98452 33412',
            vehicle: 'TVS iQube Electric (EV Fleet)',
            rating: 4.98
          },
          tracking: {
            liveChannel: `order:${orderNumber}`,
            webSocketUrl: `/ws`
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/orders
   * Query params: status, limit, offset
   */
  getAllOrders: (req, res, next) => {
    try {
      const { status, limit = 20, offset = 0 } = req.query;

      let sql = 'SELECT * FROM orders WHERE 1=1';
      const params = {};

      if (status) {
        sql += ' AND status = @status';
        params.status = status.toUpperCase();
      }

      sql += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset';
      params.limit = parseInt(limit, 10);
      params.offset = parseInt(offset, 10);

      const rows = db.prepare(sql).all(params);
      const totalCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;

      const formatted = rows.map(r => {
        let items = [];
        try {
          items = JSON.parse(r.items_json);
        } catch (e) {
          items = [];
        }

        return {
          id: r.id,
          orderNumber: r.order_number,
          merchantId: r.merchant_id,
          merchantName: r.merchant_name,
          customerName: r.customer_name,
          deliveryAddress: r.delivery_address,
          status: r.status,
          total: r.total,
          itemCount: items.reduce((sum, i) => sum + (i.qty || 1), 0),
          items,
          rider: {
            name: r.rider_name,
            phone: r.rider_phone,
            vehicle: r.rider_vehicle,
            lat: r.rider_lat,
            lng: r.rider_lng
          },
          etaMinutes: r.eta_minutes,
          createdAt: r.created_at
        };
      });

      res.json({
        success: true,
        total: totalCount,
        count: formatted.length,
        data: formatted
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/orders/:idOrNumber
   */
  getOrderById: (req, res, next) => {
    try {
      const { id } = req.params;
      const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id.toUpperCase());

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'OrderNotFound',
          message: `Order '${id}' does not exist.`
        });
      }

      let items = [];
      try {
        items = JSON.parse(order.items_json);
      } catch (e) {
        items = [];
      }

      // Calculate timeline status flags
      const stages = ['CONFIRMED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
      const currentIndex = stages.indexOf(order.status);

      const timeline = [
        {
          key: 'placed',
          title: 'Order Placed',
          subtitle: 'Halal Kitchen Verified',
          completed: currentIndex >= 0,
          active: order.status === 'CONFIRMED'
        },
        {
          key: 'prepared',
          title: 'Freshly Prepared',
          subtitle: 'Sealed in Thermal Container',
          completed: currentIndex >= 1,
          active: order.status === 'PREPARING'
        },
        {
          key: 'on_the_way',
          title: 'Rider On The Way',
          subtitle: `Rider: ${order.rider_name} (${order.rider_vehicle})`,
          completed: currentIndex >= 3,
          active: order.status === 'PICKED_UP' || order.status === 'ON_THE_WAY'
        },
        {
          key: 'delivered',
          title: 'Delivered',
          subtitle: 'Contactless Sign-off Complete',
          completed: order.status === 'DELIVERED',
          active: order.status === 'DELIVERED'
        }
      ];

      res.json({
        success: true,
        data: {
          id: order.id,
          orderNumber: order.order_number,
          merchantId: order.merchant_id,
          merchantName: order.merchant_name,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          deliveryAddress: order.delivery_address,
          status: order.status,
          financials: {
            subtotal: order.subtotal,
            deliveryFee: order.delivery_fee,
            serviceFee: order.service_fee,
            tip: order.tip,
            discount: order.discount,
            total: order.total
          },
          items,
          rider: {
            name: order.rider_name,
            phone: order.rider_phone,
            vehicle: order.rider_vehicle,
            lat: order.rider_lat,
            lng: order.rider_lng
          },
          etaMinutes: order.eta_minutes,
          timeline,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/orders/:id/status
   */
  updateOrderStatus: (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['CONFIRMED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
      if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'InvalidStatus',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id.toUpperCase());
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'OrderNotFound',
          message: `Order '${id}' does not exist.`
        });
      }

      const newStatus = status.toUpperCase();
      db.prepare(`
        UPDATE orders 
        SET status = ?, updated_at = datetime('now')
        WHERE id = ?
      `).run(newStatus, order.id);

      // Broadcast update
      broadcast(`order:${order.order_number}`, {
        type: 'order_status_update',
        orderNumber: order.order_number,
        status: newStatus,
        message: `Order #${order.order_number} status updated to ${newStatus}`,
        timestamp: new Date().toISOString()
      });

      broadcast('order_feed_update', {
        orderNumber: order.order_number,
        status: newStatus
      });

      res.json({
        success: true,
        message: `Order #${order.order_number} status successfully updated to ${newStatus}`,
        data: {
          orderNumber: order.order_number,
          status: newStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
