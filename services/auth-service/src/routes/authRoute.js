const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;