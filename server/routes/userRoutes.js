const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { orderLimiter } = require('../middleware/rateLimiter');

router.get('/profile', userController.getProfile);
router.patch('/preferences', userController.updatePreferences);
router.post('/wallet/topup', orderLimiter, userController.topupWallet);
router.get('/wallet/transactions', userController.getWalletTransactions);
router.post('/addresses', userController.addAddress);

module.exports = router;
