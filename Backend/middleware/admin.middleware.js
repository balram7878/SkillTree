// middleware/admin.middleware.js
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    logger.warn("UNAUTHORIZED_ADMIN_ACCESS", {
      userId: req.user._id,
      ip: req.ip,
      timestamp: new Date().toISOString(),
      action: "ADMIN_ACCESS_DENIED",
    });
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

module.exports = adminMiddleware;
