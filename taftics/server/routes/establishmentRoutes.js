const express = require('express');
const router = express.Router();
const establishmentController = require('../controllers/establishmentController');

router.get('/', establishmentController.getAllEstablishments);
router.get('/:id', establishmentController.getEstablishmentById);
router.put('/:id', establishmentController.updateEstablishment);
router.get('/:id/owner', establishmentController.getEstablishmentOwner);
router.get('/:id/reviews', establishmentController.getEstablishmentReviews);
router.put('/id/:image', establishmentController.uploadEstablishmentImg);

module.exports = router;