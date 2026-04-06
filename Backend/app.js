require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const authRoutes = require("./routes/auth.routes");
const passport = require("./config/passport");
require("./jobs/cleanupUnverifiedUsers");

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});



// Start server
const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("Connected to MongoDB and Redis");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

initializeServer();
