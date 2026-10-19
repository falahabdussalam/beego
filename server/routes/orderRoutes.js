const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderLimiter } = require('../middleware/rateLimiter');

router.post('/', orderLimiter, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
