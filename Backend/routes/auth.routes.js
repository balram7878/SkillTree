const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const rateLimit = require("express-rate-limit");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

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
  JWT_EXPIRY_SECONDS,
} = require("../controllers/auth/auth.controller");

router.post("/signup", authLimiter, signup);
router.post("/login", loginLimiter, login);
router.get("/verify-email", authLimiter, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerification);
router.post("/logout", authenticate, logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.get("/me", authenticate, getMe);

//OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=server_error`,
        );
      }
      if (!user) {
        // info.message has your provider mismatch message
        const message = encodeURIComponent(info?.message || "google_failed");
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${message}`,
        );
      }

      // Success
      try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: JWT_EXPIRY_SECONDS,
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: JWT_EXPIRY_SECONDS * 1000,
        });
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
      } catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
      }
    },
  )(req, res, next);
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  }),
);

router.get("/github/callback", (req, res, next) => {
  passport.authenticate(
    "github",
    {
      session: false,
    },
    (err, user, info) => {
      if (err) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=server_error`,
        );
      }
      if (!user) {
        const message = encodeURIComponent(info?.message || "github_failed");
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=${message}`,
        );
      }

      // Success
      try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: JWT_EXPIRY_SECONDS,
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: JWT_EXPIRY_SECONDS * 1000,
        });
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
      } catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
      }
    },
  )(req, res, next);
});

module.exports = router;
