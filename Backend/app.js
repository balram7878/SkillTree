require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const passport = require("./config/passport");
const logger = require("./utils/logger");
require("./jobs/cleanupUnverifiedUsers");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    logger.info("SERVER_INFO", {
      action: "Connected to MongoDB and Redis",
      timestamp: new Date().toISOString(),
    });

    app.listen(PORT, () => {
      logger.info("SERVER_INFO", {
        action: `Server running on port ${PORT}`,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    logger.error("SERVER_ERROR", {
      action: "Failed to connect to MongoDB or Redis",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    process.exit(1);
  }
};

initializeServer();
