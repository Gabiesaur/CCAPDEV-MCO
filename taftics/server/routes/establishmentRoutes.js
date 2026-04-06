const express = require("express");
const router = express.Router();
const establishmentController = require("../controllers/establishmentController");
const { upload } = require("../config/cloudinary");

router.get("/", establishmentController.getAllEstablishments);
router.get("/:id", establishmentController.getEstablishmentById);
router.put("/:id", establishmentController.updateEstablishment);
router.get("/:id/owner", establishmentController.getEstablishmentOwner);
router.get("/:id/reviews", establishmentController.getEstablishmentReviews);
router.put(
  "/:id/image",
  upload.single("image"),
  establishmentController.uploadEstablishmentImg,
);
router.post("/:id/request-deletion", establishmentController.requestDeletion);

module.exports = router;
