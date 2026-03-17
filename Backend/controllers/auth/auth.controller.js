const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../../utils/emailService");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../../validators/validators");
const redisClient = require("../../config/redis");

const generateToken = () => crypto.randomBytes(32).toString("hex");

const hashedToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const JWT_EXPIRY_SECONDS = 24 * 60 * 60; // 1 day in seconds

const generateJWT = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY_SECONDS,
  });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ message: nameValidation.message });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const existingUser = await User.findOne({
      email: emailValidation.normalized,
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await User.generatePasswordHash(password);
    const emailVerificationToken = generateToken();
    const hashedEmailToken = hashedToken(emailVerificationToken);
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name: nameValidation.normalized,
      email: emailValidation.normalized,
      passwordHash,
      emailVerificationToken: hashedEmailToken,
      emailVerificationExpires,
    });

    await sendVerificationEmail(user.email, emailVerificationToken);

    res.status(201).json({
      message:
        "Account created successfully. Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
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

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    const user = await User.findOne({ email: emailValidation.normalized });

    if (!user) {
      await bcrypt.compare(password, "$2b$10$dummyhashfortimingprotection");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const shouldResend =
        !user.emailVerificationExpires ||
        user.emailVerificationExpires < Date.now();

      if (shouldResend) {
        const emailVerificationToken = generateToken();
        user.emailVerificationToken = hashedToken(emailVerificationToken);
        user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        await sendVerificationEmail(user.email, emailVerificationToken);
      }

      return res.json({ nextStep: "VERIFY_EMAIL", email: user.email });
    }
    // if (!user.username) {
    //   return res.json({
    //     nextStep: "CHOOSE_USERNAME",
    //   });
    // }

    const token = generateJWT(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: JWT_EXPIRY_SECONDS * 1000,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
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

// POST /api/auth/verify-email?token=TOKEN
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const user = await User.findOne({
      emailVerificationToken: hashedToken(token),
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Auto-login after successful email verification
    const jwtToken = generateJWT(user._id);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: JWT_EXPIRY_SECONDS * 1000,
    });

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
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

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    // Always return success to prevent email enumeration
    const user = await User.findOne({ email: emailValidation.normalized });
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    const resetToken = generateToken();
    user.passwordResetToken = hashedToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
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
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const user = await User.findOne({
      passwordResetToken: hashedToken(token),
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
    user.passwordChangedAt = Date.now();
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
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    const user = await User.findOne({ email: emailValidation.normalized });

    // Always return success to prevent email enumeration
    if (!user || user.isEmailVerified) {
      return res.json({
        message:
          "If your email is registered and unverified, a verification email has been sent.",
      });
    }

    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationToken = hashedToken(emailVerificationToken);
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    await sendVerificationEmail(user.email, emailVerificationToken);

    res.json({
      message:
        "If your email is registered and unverified, a verification email has been sent.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const remainingTime = decodedToken.exp - Math.floor(Date.now() / 1000);

    if (remainingTime > 0) {
      await redisClient.set(`blacklist_${req.token}`, "true", {
        EX: remainingTime,
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  resendVerification,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
