const { db } = require('../db/database');

const DEFAULT_USER_ID = 'user_falah';

/**
 * Controller for User Profile, Wallet and Saved Addresses
 */
const userController = {
  /**
   * GET /api/user/profile
   */
  getProfile: (req, res, next) => {
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(DEFAULT_USER_ID);
      if (!user) {
        return res.status(404).json({ success: false, error: 'UserNotFound' });
      }

      // Fetch saved addresses
      const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at ASC').all(DEFAULT_USER_ID);

      // Fetch recent orders & courier dispatches
      const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 6').all(DEFAULT_USER_ID);
      const couriers = db.prepare('SELECT * FROM courier_bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT 6').all(DEFAULT_USER_ID);

      const parsedOrders = orders.map(o => {
        let items = [];
        try { items = JSON.parse(o.items_json); } catch (e) { items = []; }
        return {
          id: o.id,
          orderNumber: o.order_number,
          merchantName: o.merchant_name,
          status: o.status,
          total: o.total,
          itemsCount: items.length,
          firstItemName: items[0]?.name || 'Halal Meal',
          createdAt: o.created_at,
          isCourier: false
        };
      });

      const parsedCouriers = couriers.map(c => ({
        id: c.id,
        orderNumber: c.booking_number,
        merchantName: `Town Courier: ${c.origin_name} → ${c.dest_name}`,
        status: c.status,
        total: c.fare,
        itemsCount: 1,
        firstItemName: c.package_name || 'Town Courier Parcel',
        createdAt: c.created_at,
        isCourier: true
      }));

      const combinedActivity = [...parsedOrders, ...parsedCouriers]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatar_url,
          location: user.location || 'Virajpet Town, Kodagu 571218',
          membership: user.membership,
          walletBalance: user.wallet_balance,
          preferences: {
            spiceLevel: user.spice_level,
            ecoPackaging: Boolean(user.eco_pack)
          },
          savedAddresses: addresses.map(a => ({
            id: a.id,
            title: a.title,
            subtitle: a.subtitle,
            addressLine: a.address_line,
            landmark: a.landmark,
            lat: a.lat,
            lng: a.lng,
            preset: a.preset,
            isDefault: Boolean(a.is_default)
          })),
          recentOrders: combinedActivity
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/user/profile
   * PUT /api/user/profile
   */
  updateProfile: (req, res, next) => {
    try {
      const { name, email, phone, avatarUrl, location } = req.body;

      const updates = [];
      const params = [];

      if (name !== undefined) {
        const trimmedName = String(name).trim();
        if (!trimmedName) {
          return res.status(400).json({
            success: false,
            error: 'InvalidName',
            message: 'Name cannot be empty.'
          });
        }
        updates.push('name = ?');
        params.push(trimmedName);
      }

      if (email !== undefined) {
        updates.push('email = ?');
        params.push(String(email).trim());
      }

      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(String(phone).trim());
      }

      if (avatarUrl !== undefined) {
        updates.push('avatar_url = ?');
        params.push(String(avatarUrl).trim());
      }

      if (location !== undefined) {
        updates.push('location = ?');
        params.push(String(location).trim());
      }

      if (updates.length > 0) {
        params.push(DEFAULT_USER_ID);
        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      }

      const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(DEFAULT_USER_ID);

      res.json({
        success: true,
        message: 'Profile updated successfully!',
        data: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          avatarUrl: updated.avatar_url,
          location: updated.location || 'Virajpet Town, Kodagu 571218',
          membership: updated.membership,
          walletBalance: updated.wallet_balance
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/user/preferences
   */
  updatePreferences: (req, res, next) => {
    try {
      const { spiceLevel, ecoPackaging } = req.body;

      const updates = [];
      const params = [DEFAULT_USER_ID];

      if (spiceLevel !== undefined) {
        updates.push('spice_level = ?');
        params.unshift(spiceLevel);
      }
      if (ecoPackaging !== undefined) {
        updates.push('eco_pack = ?');
        params.unshift(ecoPackaging ? 1 : 0);
      }

      if (updates.length > 0) {
        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      }

      const updated = db.prepare('SELECT spice_level, eco_pack FROM users WHERE id = ?').get(DEFAULT_USER_ID);

      res.json({
        success: true,
        message: 'User preferences updated successfully.',
        data: {
          spiceLevel: updated.spice_level,
          ecoPackaging: Boolean(updated.eco_pack)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/user/wallet/topup
   */
  topupWallet: (req, res, next) => {
    try {
      const { amount, paymentMethod = 'UPI', upiId = 'falah@okaxis' } = req.body;
      const numAmount = parseFloat(amount);

      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'InvalidAmount',
          message: 'Top-up amount must be a positive number.'
        });
      }

      if (numAmount > 20000) {
        return res.status(400).json({
          success: false,
          error: 'LimitExceeded',
          message: 'Maximum single top-up limit is ₹20,000.'
        });
      }

      let newBalance = 0;
      const txId = `tx_${Date.now()}`;
      const refId = `UPI-${Math.floor(100000 + Math.random() * 900000)}`;

      const topupTxn = db.transaction(() => {
        const user = db.prepare('SELECT wallet_balance FROM users WHERE id = ?').get(DEFAULT_USER_ID);
        newBalance = (user ? user.wallet_balance : 0) + numAmount;

        db.prepare('UPDATE users SET wallet_balance = ? WHERE id = ?').run(newBalance, DEFAULT_USER_ID);

        db.prepare(`
          INSERT INTO wallet_transactions (id, user_id, amount, type, description, balance_after, reference_id)
          VALUES (?, ?, ?, 'CREDIT', ?, ?, ?)
        `).run(txId, DEFAULT_USER_ID, numAmount, `Wallet Top-Up via ${paymentMethod} (${upiId})`, newBalance, refId);
      });

      topupTxn();

      res.json({
        success: true,
        message: `₹${numAmount.toLocaleString('en-IN')} added to your BEEGO Wallet!`,
        data: {
          transactionId: txId,
          referenceId: refId,
          addedAmount: numAmount,
          newBalance: Math.round(newBalance * 100) / 100,
          currency: '₹'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/user/addresses
   */
  addAddress: (req, res, next) => {
    try {
      const { title, subtitle, addressLine, landmark, lat, lng, preset = 'Other' } = req.body;

      if (!title || !addressLine) {
        return res.status(400).json({
          success: false,
          error: 'MissingFields',
          message: 'Address title and address line are required.'
        });
      }

      const id = `addr_${Date.now()}`;
      db.prepare(`
        INSERT INTO addresses (id, user_id, title, subtitle, address_line, landmark, lat, lng, preset, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `).run(id, DEFAULT_USER_ID, title, subtitle || '', addressLine, landmark || '', lat || 12.2015, lng || 75.8034, preset);

      res.status(201).json({
        success: true,
        message: 'New Virajpet address saved to your profile!',
        data: {
          id,
          title,
          subtitle,
          addressLine,
          landmark,
          lat,
          lng,
          preset
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/user/wallet/transactions
   */
  getWalletTransactions: (req, res, next) => {
    try {
      const txns = db.prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(DEFAULT_USER_ID);

      res.json({
        success: true,
        count: txns.length,
        data: txns.map(t => ({
          id: t.id,
          amount: t.amount,
          type: t.type,
          description: t.description,
          balanceAfter: t.balance_after,
          referenceId: t.reference_id,
          createdAt: t.created_at
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/user/addresses/:id
   */
  deleteAddress: (req, res, next) => {
    try {
      const { id } = req.params;
      const result = db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, DEFAULT_USER_ID);
      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          error: 'AddressNotFound',
          message: `Address '${id}' was not found.`
        });
      }
      res.json({
        success: true,
        message: 'Saved address deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/user/addresses/:id/default
   */
  setDefaultAddress: (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(id, DEFAULT_USER_ID);
      if (!exists) {
        return res.status(404).json({
          success: false,
          error: 'AddressNotFound',
          message: `Address '${id}' was not found.`
        });
      }

      db.transaction(() => {
        db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(DEFAULT_USER_ID);
        db.prepare('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?').run(id, DEFAULT_USER_ID);
      })();

      res.json({
        success: true,
        message: 'Default delivery address updated.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
