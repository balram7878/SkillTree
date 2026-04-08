const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const { getFilteredLogs } = require("../controllers/admin/admin.controller");

const adminRouter = Router();

adminRouter.get("/logs", authMiddleware, adminMiddleware, getFilteredLogs);

module.exports = adminRouter;
