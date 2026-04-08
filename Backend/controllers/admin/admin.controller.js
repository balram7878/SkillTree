const getFilteredLogs = async (req, res) => {
  try {
    const { action, from, to, userId } = req.query;
    const fs = await import("fs");
    const lines = fs
      .readFileSync("logs/combined.log", "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));

    let filtered = lines;
    if (action) filtered = filtered.filter((l) => l.action === action);
    if (userId) filtered = filtered.filter((l) => l.userId === userId);
    if (from)
      filtered = filtered.filter(
        (l) => new Date(l.timestamp) >= new Date(from),
      );
    if (to)
      filtered = filtered.filter((l) => new Date(l.timestamp) <= new Date(to));

    res.status(200).json({ total: filtered.length, logs: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFilteredLogs,
};
