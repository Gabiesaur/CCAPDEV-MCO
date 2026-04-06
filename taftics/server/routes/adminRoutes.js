const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getAdminStats);
router.get('/pending-establishments', adminController.getPendingEstablishments);
router.post('/establishments/:id/approve', adminController.approveEstablishment);
router.delete('/establishments/:id', adminController.deleteEstablishment);
router.get('/deletion-requests', adminController.getDeletionRequests);
router.post('/establishments/:id/handle-deletion', adminController.handleDeletionRequest);
router.put('/users/:id/role', adminController.toggleAdminRole);

module.exports = router;