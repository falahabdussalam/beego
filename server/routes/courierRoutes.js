const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');
const { orderLimiter } = require('../middleware/rateLimiter');

router.post('/quote', courierController.calculateFare);
router.post('/book', orderLimiter, courierController.bookCourier);
router.get('/localities', courierController.getLocalities);
router.get('/:id', courierController.getBookingById);

module.exports = router;
