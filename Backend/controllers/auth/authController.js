const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");

const generateToken = () => crypto.randomBytes(32).toString("hex");

const generateJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase() ? "Email" : "Username";
      return res.status(409).json({ message: `${field} already exists` });
    }

    const passwordHash = await User.generatePasswordHash(password);
    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours

    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await sendVerificationEmail(user.email, emailVerificationToken);

    res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const token = generateJWT(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/auth/verify-email?token=TOKEN
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Always return success to prevent email enumeration
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    const resetToken = generateToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.passwordHash = await User.generatePasswordHash(password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        authProvider: req.user.authProvider,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
