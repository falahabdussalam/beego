const { db } = require('../db/database');

/**
 * Controller for Merchants and Menus
 */
const merchantController = {
  /**
   * GET /api/merchants
   * Query params:
   *  - category: 'all' | 'food' | 'grocery' | 'medicine' | 'beverages' | 'desserts' | 'courier'
   *  - search: string
   *  - sort: 'rating' | 'deliveryTime' | 'name'
   */
  getAllMerchants: (req, res, next) => {
    try {
      const { category, search, sort } = req.query;

      let sql = 'SELECT * FROM merchants WHERE is_active = 1';
      const params = {};

      if (category && category !== 'all') {
        sql += ' AND category = @category';
        params.category = category.toLowerCase().trim();
      }

      if (search && search.trim()) {
        sql += ' AND (LOWER(name) LIKE @search OR LOWER(cuisine) LIKE @search OR LOWER(location) LIKE @search)';
        params.search = `%${search.toLowerCase().trim()}%`;
      }

      if (sort === 'rating') {
        sql += ' ORDER BY rating DESC';
      } else if (sort === 'deliveryFee') {
        sql += ' ORDER BY delivery_fee ASC';
      } else {
        sql += ' ORDER BY rating DESC, name ASC';
      }

      const merchants = db.prepare(sql).all(params);

      // Fetch items for each merchant
      const getItemsStmt = db.prepare('SELECT * FROM menu_items WHERE merchant_id = ? AND is_available = 1');
      const enriched = merchants.map(m => {
        const items = getItemsStmt.all(m.id).map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          desc: item.description,
          image: item.image,
          category: item.category
        }));

        return {
          id: m.id,
          name: m.name,
          category: m.category,
          cuisine: m.cuisine,
          rating: m.rating,
          reviewsCount: m.reviews_count,
          deliveryTime: m.delivery_time,
          deliveryFee: m.delivery_fee,
          minOrder: m.min_order,
          featuredBadge: m.featured_badge,
          image: m.image,
          bannerImage: m.banner_image,
          location: m.location,
          itemsCount: items.length,
          items
        };
      });

      res.json({
        success: true,
        count: enriched.length,
        data: enriched
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/merchants/:id
   */
  getMerchantById: (req, res, next) => {
    try {
      const { id } = req.params;
      const merchant = db.prepare('SELECT * FROM merchants WHERE id = ?').get(id);

      if (!merchant) {
        return res.status(404).json({
          success: false,
          error: 'MerchantNotFound',
          message: `Merchant with ID '${id}' was not found.`
        });
      }

      const items = db.prepare('SELECT * FROM menu_items WHERE merchant_id = ? AND is_available = 1').all(id).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        desc: item.description,
        image: item.image,
        category: item.category
      }));

      // Group items by category for convenience
      const categories = {};
      items.forEach(item => {
        const cat = item.category || 'Specialties';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(item);
      });

      res.json({
        success: true,
        data: {
          id: merchant.id,
          name: merchant.name,
          category: merchant.category,
          cuisine: merchant.cuisine,
          rating: merchant.rating,
          reviewsCount: merchant.reviews_count,
          deliveryTime: merchant.delivery_time,
          deliveryFee: merchant.delivery_fee,
          minOrder: merchant.min_order,
          featuredBadge: merchant.featured_badge,
          image: merchant.image,
          bannerImage: merchant.banner_image,
          location: merchant.location,
          itemsCount: items.length,
          items,
          categorizedMenu: categories
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/categories
   */
  getCategories: (req, res, next) => {
    try {
      const rows = db.prepare(`
        SELECT category, COUNT(*) as count 
        FROM merchants 
        WHERE is_active = 1 
        GROUP BY category
      `).all();

      const metadata = {
        food: { title: '100% Halal Food', icon: '🍗', desc: 'Kodagu koli curry, dum biryani & kebabs' },
        grocery: { title: 'Estate Spices & Grocery', icon: '🌶️', desc: 'Ponni rice, wild honey & black pepper' },
        medicine: { title: 'Pharmacy & Wellness', icon: '💊', desc: 'Mountain pain balms, first aid & care' },
        beverages: { title: 'Estate Coffee & Teas', icon: '☕', desc: 'Pure Arabica filter kaapi & sulaimani' },
        desserts: { title: 'Bakes & Desserts', icon: '🧁', desc: 'Coorg honey tea cakes, falooda & sweets' },
        courier: { title: 'Town Courier', icon: '⚡', desc: 'Express documents, tiffins & parcel logistics' }
      };

      const categories = rows.map(r => ({
        id: r.category,
        count: r.count,
        title: metadata[r.category]?.title || r.category,
        icon: metadata[r.category]?.icon || '📦',
        desc: metadata[r.category]?.desc || ''
      }));

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = merchantController;
