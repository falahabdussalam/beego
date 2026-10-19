const { db } = require('../db/database');

/**
 * Controller for Promo Codes and Offers
 */
const promoController = {
  /**
   * POST /api/promos/validate
   * Body: { code, subtotal, deliveryFee }
   */
  validatePromo: (req, res, next) => {
    try {
      const { code, subtotal = 0, deliveryFee = 25.0 } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'MissingPromoCode',
          message: 'Promo code is required.'
        });
      }

      const cleanCode = code.trim().toUpperCase();
      const promo = db.prepare('SELECT * FROM promos WHERE code = ? AND is_active = 1').get(cleanCode);

      if (!promo) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Invalid promo code '${code}'. Try 'BEEGO10' or 'BEEGOFIRST'.`
        });
      }

      const numSubtotal = parseFloat(subtotal) || 0;
      if (numSubtotal < promo.min_order) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Minimum order amount of ₹${promo.min_order} required to use code '${promo.code}'.`
        });
      }

      let discount = 0;
      let benefitText = '';

      if (promo.type === 'PERCENTAGE') {
        discount = Math.min(promo.max_discount, (numSubtotal * promo.value) / 100);
        benefitText = `${promo.value}% discount applied (-₹${discount.toFixed(2)})`;
      } else if (promo.type === 'FREE_DELIVERY') {
        discount = parseFloat(deliveryFee) || 25.0;
        benefitText = 'Complimentary Virajpet town delivery applied!';
      } else if (promo.type === 'FLAT') {
        discount = Math.min(promo.max_discount, promo.value);
        benefitText = `Flat ₹${discount.toFixed(2)} OFF applied!`;
      }

      res.json({
        success: true,
        valid: true,
        data: {
          code: promo.code,
          type: promo.type,
          discountAmount: Math.round(discount * 100) / 100,
          benefitText,
          description: promo.description
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/promos
   */
  getAllPromos: (req, res, next) => {
    try {
      const promos = db.prepare('SELECT code, type, value, min_order, max_discount, description FROM promos WHERE is_active = 1').all();
      res.json({
        success: true,
        count: promos.length,
        data: promos
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = promoController;
