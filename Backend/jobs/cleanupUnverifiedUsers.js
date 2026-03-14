const cron = require("node-cron");
const userModel = require("../models/User.model");

cron.schedule("0 * * * *", async () => {
  try {
    console.log("Cleanup job executed at:", new Date());
    const result = await userModel.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    console.log(`Cleanup job removed ${result.deletedCount} users`);
  } catch (error) {
    console.error("Cleanup job error:", error);
  }
});
