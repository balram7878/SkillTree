const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth/authController");

router.post("/signup", signup);
router.post("/login",  login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getMe);

module.exports = router;
