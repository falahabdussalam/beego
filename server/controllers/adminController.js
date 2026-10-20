const { db } = require('../db/database');
const { getConnectedClientsCount } = require('../websocket');

/**
 * Controller for Store Owner & Operations Admin Dashboard
 */
const adminController = {
  /**
   * GET /api/admin/stats
   * Aggregated system and business metrics
   */
  getStats: (req, res, next) => {
    try {
      const totalOrders = db.prepare('SELECT count(*) as c FROM orders').get().c;
      const activeOrders = db.prepare("SELECT count(*) as c FROM orders WHERE status NOT IN ('DELIVERED', 'CANCELLED')").get().c;
      const grossRevenue = db.prepare("SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE status != 'CANCELLED'").get().rev;
      const totalMerchants = db.prepare('SELECT count(*) as c FROM merchants WHERE is_active = 1').get().c;
      const totalItems = db.prepare('SELECT count(*) as c FROM menu_items').get().c;
      const inStockItems = db.prepare('SELECT count(*) as c FROM menu_items WHERE is_available = 1').get().c;
      const categoriesRow = db.prepare('SELECT count(DISTINCT category) as c FROM menu_items').get().c;

      res.json({
        success: true,
        data: {
          totalOrders,
          activeOrders,
          grossRevenue,
          totalMerchants,
          totalItems,
          inStockItems,
          outOfStockItems: totalItems - inStockItems,
          categoriesCount: categoriesRow,
          inStockRate: totalItems > 0 ? Math.round((inStockItems / totalItems) * 100) : 100,
          activeWebsockets: getConnectedClientsCount()
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/items
   * Fetch all menu items / products with filters
   */
  getItems: (req, res, next) => {
    try {
      const { merchantId, category, search, status } = req.query;

      let sql = `
        SELECT 
          mi.id,
          mi.merchant_id,
          mi.name,
          mi.price,
          mi.description,
          mi.image,
          mi.category,
          mi.is_available,
          mi.created_at,
          m.name as merchant_name,
          m.category as merchant_category
        FROM menu_items mi
        LEFT JOIN merchants m ON mi.merchant_id = m.id
        WHERE 1=1
      `;
      const params = {};

      if (merchantId && merchantId !== 'all') {
        sql += ' AND mi.merchant_id = @merchantId';
        params.merchantId = merchantId;
      }

      if (category && category !== 'all') {
        sql += ' AND LOWER(mi.category) = @category';
        params.category = category.toLowerCase().trim();
      }

      if (status === 'in_stock') {
        sql += ' AND mi.is_available = 1';
      } else if (status === 'out_of_stock') {
        sql += ' AND mi.is_available = 0';
      }

      if (search && search.trim()) {
        sql += ' AND (LOWER(mi.name) LIKE @search OR LOWER(mi.description) LIKE @search OR LOWER(mi.category) LIKE @search OR LOWER(m.name) LIKE @search)';
        params.search = `%${search.toLowerCase().trim()}%`;
      }

      sql += ' ORDER BY m.name ASC, mi.category ASC, mi.name ASC';

      const items = db.prepare(sql).all(params);

      res.json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/items/:id
   */
  getItemById: (req, res, next) => {
    try {
      const { id } = req.params;
      const item = db.prepare(`
        SELECT mi.*, m.name as merchant_name, m.category as merchant_category
        FROM menu_items mi
        LEFT JOIN merchants m ON mi.merchant_id = m.id
        WHERE mi.id = ?
      `).get(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'ItemNotFound',
          message: `Product item with ID '${id}' was not found.`
        });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/admin/items
   * Add a new product to a restaurant, cafe, or grocery store
   */
  createItem: (req, res, next) => {
    try {
      const { merchant_id, name, price, description, category, image, is_available } = req.body;

      if (!merchant_id || !name || price === undefined || price === null) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'merchant_id, product name, and price are required fields.'
        });
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Price must be a valid positive number greater than 0.'
        });
      }

      // Check if merchant exists
      const merchant = db.prepare('SELECT id, name FROM merchants WHERE id = ?').get(merchant_id);
      if (!merchant) {
        return res.status(404).json({
          success: false,
          error: 'MerchantNotFound',
          message: `Merchant with ID '${merchant_id}' does not exist.`
        });
      }

      const id = `item_${Date.now()}`;
      const defaultDesc = description ? description.trim() : 'Freshly prepared authentic Kodagu delicacy with certified ingredients.';
      const defaultCat = category ? category.trim() : 'Chef Special';
      const defaultImg = image ? image.trim() : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
      const available = is_available !== undefined && is_available !== null ? (is_available ? 1 : 0) : 1;

      const stmt = db.prepare(`
        INSERT INTO menu_items (id, merchant_id, name, price, description, image, category, is_available)
        VALUES (@id, @merchant_id, @name, @price, @description, @image, @category, @is_available)
      `);

      stmt.run({
        id,
        merchant_id,
        name: name.trim(),
        price: parsedPrice,
        description: defaultDesc,
        image: defaultImg,
        category: defaultCat,
        is_available: available
      });

      const newItem = db.prepare(`
        SELECT mi.*, m.name as merchant_name, m.category as merchant_category
        FROM menu_items mi
        LEFT JOIN merchants m ON mi.merchant_id = m.id
        WHERE mi.id = ?
      `).get(id);

      res.status(201).json({
        success: true,
        message: `Product '${newItem.name}' added successfully to ${merchant.name}.`,
        data: newItem
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/admin/items/:id
   * Edit product details: name, price, category, description, image, availability
   */
  updateItem: (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, description, category, image, is_available, merchant_id } = req.body;

      const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'ItemNotFound',
          message: `Product with ID '${id}' was not found.`
        });
      }

      const newName = name !== undefined ? name.trim() : existing.name;
      if (!newName) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Product name cannot be empty.'
        });
      }

      let newPrice = existing.price;
      if (price !== undefined) {
        newPrice = parseFloat(price);
        if (isNaN(newPrice) || newPrice <= 0) {
          return res.status(400).json({
            success: false,
            error: 'ValidationError',
            message: 'Price must be a valid positive number.'
          });
        }
      }

      const newDesc = description !== undefined ? description.trim() : existing.description;
      const newCat = category !== undefined ? category.trim() : existing.category;
      const newImg = image !== undefined ? image.trim() : existing.image;
      const newAvailable = is_available !== undefined ? (is_available ? 1 : 0) : existing.is_available;
      const newMerchantId = merchant_id !== undefined ? merchant_id : existing.merchant_id;

      if (merchant_id) {
        const merchant = db.prepare('SELECT id FROM merchants WHERE id = ?').get(merchant_id);
        if (!merchant) {
          return res.status(404).json({
            success: false,
            error: 'MerchantNotFound',
            message: `Merchant with ID '${merchant_id}' does not exist.`
          });
        }
      }

      const updateStmt = db.prepare(`
        UPDATE menu_items
        SET name = @name,
            price = @price,
            description = @description,
            category = @category,
            image = @image,
            is_available = @is_available,
            merchant_id = @merchant_id
        WHERE id = @id
      `);

      updateStmt.run({
        id,
        name: newName,
        price: newPrice,
        description: newDesc,
        category: newCat,
        image: newImg,
        is_available: newAvailable,
        merchant_id: newMerchantId
      });

      const updated = db.prepare(`
        SELECT mi.*, m.name as merchant_name, m.category as merchant_category
        FROM menu_items mi
        LEFT JOIN merchants m ON mi.merchant_id = m.id
        WHERE mi.id = ?
      `).get(id);

      res.json({
        success: true,
        message: `Product '${updated.name}' updated successfully.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/admin/items/:id/availability
   * Quick toggle In-Stock / Out-of-Stock
   */
  toggleItemAvailability: (req, res, next) => {
    try {
      const { id } = req.params;
      const item = db.prepare('SELECT id, name, is_available FROM menu_items WHERE id = ?').get(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'ItemNotFound',
          message: `Product with ID '${id}' was not found.`
        });
      }

      let newStatus;
      if (req.body && req.body.is_available !== undefined) {
        newStatus = req.body.is_available ? 1 : 0;
      } else {
        newStatus = item.is_available === 1 ? 0 : 1;
      }

      db.prepare('UPDATE menu_items SET is_available = ? WHERE id = ?').run(newStatus, id);

      res.json({
        success: true,
        message: `Product '${item.name}' is now ${newStatus === 1 ? 'In Stock' : 'Out of Stock'}.`,
        is_available: newStatus
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/admin/items/:id
   * Permanently delete a product
   */
  deleteItem: (req, res, next) => {
    try {
      const { id } = req.params;
      const item = db.prepare('SELECT id, name, merchant_id FROM menu_items WHERE id = ?').get(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'ItemNotFound',
          message: `Product with ID '${id}' was not found.`
        });
      }

      db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);

      res.json({
        success: true,
        message: `Product '${item.name}' deleted successfully.`
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/admin/merchants
   * List all merchants with inventory counts
   */
  getMerchants: (req, res, next) => {
    try {
      const merchants = db.prepare(`
        SELECT 
          m.*,
          (SELECT COUNT(*) FROM menu_items WHERE merchant_id = m.id) as total_items,
          (SELECT COUNT(*) FROM menu_items WHERE merchant_id = m.id AND is_available = 1) as in_stock_items
        FROM merchants m
        ORDER BY m.rating DESC, m.name ASC
      `).all();

      // Fetch distinct categories per merchant
      const catStmt = db.prepare('SELECT DISTINCT category FROM menu_items WHERE merchant_id = ?');
      const enriched = merchants.map(m => {
        const categories = catStmt.all(m.id).map(r => r.category).filter(Boolean);
        return {
          ...m,
          categories
        };
      });

      res.json({
        success: true,
        count: enriched.length,
        data: enriched
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/admin/merchants
   * Register a new restaurant, cafe, or grocery store
   */
  createMerchant: (req, res, next) => {
    try {
      const {
        name,
        category,
        cuisine,
        delivery_time,
        delivery_fee,
        min_order,
        location,
        image,
        banner_image,
        featured_badge
      } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Store name is required.'
        });
      }

      const validCategories = ['food', 'beverages', 'desserts', 'grocery', 'medicine'];
      const cat = (category || 'food').toLowerCase().trim();
      if (!validCategories.includes(cat)) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: `Category must be one of: ${validCategories.join(', ')}`
        });
      }

      const id = `m_${Date.now()}`;
      const defaultImg = image ? image.trim() : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';
      const defaultBanner = banner_image ? banner_image.trim() : defaultImg;

      const stmt = db.prepare(`
        INSERT INTO merchants (
          id, name, category, cuisine, rating, reviews_count, delivery_time,
          delivery_fee, min_order, featured_badge, image, banner_image, location, is_active
        ) VALUES (
          @id, @name, @category, @cuisine, 5.0, 'New Partner', @delivery_time,
          @delivery_fee, @min_order, @featured_badge, @image, @banner_image, @location, 1
        )
      `);

      stmt.run({
        id,
        name: name.trim(),
        category: cat,
        cuisine: cuisine ? cuisine.trim() : 'Authentic Kodagu Specialties',
        delivery_time: delivery_time ? delivery_time.trim() : '20-30 min',
        delivery_fee: delivery_fee !== undefined ? parseFloat(delivery_fee) : 25.0,
        min_order: min_order !== undefined ? parseFloat(min_order) : 100.0,
        featured_badge: featured_badge ? featured_badge.trim() : 'NEW PARTNER',
        image: defaultImg,
        banner_image: defaultBanner,
        location: location ? location.trim() : 'Virajpet Town, Kodagu'
      });

      const newMerchant = db.prepare('SELECT * FROM merchants WHERE id = ?').get(id);

      res.status(201).json({
        success: true,
        message: `Merchant '${newMerchant.name}' registered successfully.`,
        data: newMerchant
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/admin/merchants/:id
   * Update store profile, delivery fees, hours, etc.
   */
  updateMerchant: (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = db.prepare('SELECT * FROM merchants WHERE id = ?').get(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'MerchantNotFound',
          message: `Merchant with ID '${id}' was not found.`
        });
      }

      const {
        name,
        category,
        cuisine,
        delivery_time,
        delivery_fee,
        min_order,
        location,
        image,
        banner_image,
        featured_badge,
        is_active
      } = req.body;

      const newName = name !== undefined ? name.trim() : existing.name;
      if (!newName) {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Store name cannot be empty.'
        });
      }

      const newCat = category !== undefined ? category.toLowerCase().trim() : existing.category;
      const newCuisine = cuisine !== undefined ? cuisine.trim() : existing.cuisine;
      const newDeliveryTime = delivery_time !== undefined ? delivery_time.trim() : existing.delivery_time;
      const newDeliveryFee = delivery_fee !== undefined ? parseFloat(delivery_fee) : existing.delivery_fee;
      const newMinOrder = min_order !== undefined ? parseFloat(min_order) : existing.min_order;
      const newLocation = location !== undefined ? location.trim() : existing.location;
      const newImage = image !== undefined ? image.trim() : existing.image;
      const newBanner = banner_image !== undefined ? banner_image.trim() : existing.banner_image;
      const newBadge = featured_badge !== undefined ? featured_badge.trim() : existing.featured_badge;
      const newActive = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;

      const stmt = db.prepare(`
        UPDATE merchants
        SET name = @name,
            category = @category,
            cuisine = @cuisine,
            delivery_time = @delivery_time,
            delivery_fee = @delivery_fee,
            min_order = @min_order,
            location = @location,
            image = @image,
            banner_image = @banner_image,
            featured_badge = @featured_badge,
            is_active = @is_active
        WHERE id = @id
      `);

      stmt.run({
        id,
        name: newName,
        category: newCat,
        cuisine: newCuisine,
        delivery_time: newDeliveryTime,
        delivery_fee: newDeliveryFee,
        min_order: newMinOrder,
        location: newLocation,
        image: newImage,
        banner_image: newBanner,
        featured_badge: newBadge,
        is_active: newActive
      });

      const updated = db.prepare('SELECT * FROM merchants WHERE id = ?').get(id);

      res.json({
        success: true,
        message: `Merchant '${updated.name}' updated successfully.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/admin/merchants/:id
   */
  deleteMerchant: (req, res, next) => {
    try {
      const { id } = req.params;
      const merchant = db.prepare('SELECT id, name FROM merchants WHERE id = ?').get(id);

      if (!merchant) {
        return res.status(404).json({
          success: false,
          error: 'MerchantNotFound',
          message: `Merchant with ID '${id}' was not found.`
        });
      }

      // Deactivate merchant or delete
      db.prepare('DELETE FROM menu_items WHERE merchant_id = ?').run(id);
      db.prepare('DELETE FROM merchants WHERE id = ?').run(id);

      res.json({
        success: true,
        message: `Store '${merchant.name}' and all associated products were removed.`
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = adminController;
