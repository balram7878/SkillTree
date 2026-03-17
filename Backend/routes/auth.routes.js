const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again later",
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset attempts",
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many reset attempts",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts",
});

const {
  signup,
  login,
  verifyEmail,
  resendVerification,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth/auth.controller");

router.post("/signup", authLimiter, signup);
router.post("/login", loginLimiter, login);
router.get("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);
router.post("/logout", authenticate, logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.get("/me", authenticate, getMe);

module.exports = router;
