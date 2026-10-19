const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');

router.get('/', merchantController.getAllMerchants);
router.get('/categories', merchantController.getCategories);
router.get('/:id', merchantController.getMerchantById);

module.exports = router;
