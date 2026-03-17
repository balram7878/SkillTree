const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const userModel = require("../models/user.model");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    const user = await userModel
      .findById(decodedToken.id)
      .select("passwordChangedAt")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    const tokenIssuedAt = decodedToken.iat * 1000;
    const passwordChangedAt = user?.passwordChangedAt
      ? new Date(user.passwordChangedAt).getTime()
      : null;

    if (passwordChangedAt && tokenIssuedAt < passwordChangedAt) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return res
        .status(401)
        .json({ message: "Password changed, please login again" });
    }

    req.user = decodedToken;
    req.token = token;
    req.decodedToken = decodedToken;

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = authenticate;
