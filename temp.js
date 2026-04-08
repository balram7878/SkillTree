const fs = require("fs");
const adminLogs = (req, res = null) => {
  const { action, userId, from, to } = req.body;
  const logs = fs
    .readFileSync("./error.log", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  // console.log(logs);
  let filtered = logs;
  if (action) filtered = filtered.filter((log) => log.action === action);
  if (userId) filtered = filtered.filter((log) => log.userId === userId);
  if (from) filtered = filtered.filter((log) => new Date(log.timestamp)>= new Date(from));
  if (to) filtered = filtered.filter((log) => new Date(log.timestamp) <= new Date(to));
  console.log(filtered);
};

adminLogs({
  body: {
    // action: "LOGIN_FAILED",
    // userId: "abc123",
    // from: "2024-04-08",
    // to: "2024-12-31",
  },
});
