const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');

// ============================================================================
// REST API ENDPOINTS FOR STORE & PRODUCT MANAGEMENT
// ============================================================================
router.get('/stats', adminController.getStats);
router.get('/items', adminController.getItems);
router.get('/items/:id', adminController.getItemById);
router.post('/items', adminController.createItem);
router.put('/items/:id', adminController.updateItem);
router.patch('/items/:id/availability', adminController.toggleItemAvailability);
router.delete('/items/:id', adminController.deleteItem);

router.get('/merchants', adminController.getMerchants);
router.post('/merchants', adminController.createMerchant);
router.put('/merchants/:id', adminController.updateMerchant);
router.delete('/merchants/:id', adminController.deleteMerchant);

// ============================================================================
// ADMIN DASHBOARD HTML INTERFACE
// ============================================================================
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

module.exports = router;
