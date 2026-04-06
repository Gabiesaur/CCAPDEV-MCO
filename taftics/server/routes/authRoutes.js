const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { upload } = require("../config/cloudinary");

router.post("/login", authController.login);
router.post("/register", upload.single("avatar"), authController.register);
router.post("/apply", authController.apply);

module.exports = router;
