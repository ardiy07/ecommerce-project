const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema, sendOTPSchema } = require("../schemas");

router.post("/login", validate(loginSchema), authController.loginUser);
router.post("/register", validate(registerSchema), authController.createUserAccount);
router.post("/send-otp", validate(sendOTPSchema), authController.sendOtpToEmail);
router.post("/validate-otp", authController.validateOtp);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
