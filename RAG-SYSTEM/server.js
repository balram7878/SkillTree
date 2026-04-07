import express from "express";
import { pipeline } from "@xenova/transformers";
import { searchPinecone } from "./config/pinecone.js";
import { getEmbedder } from "./config/embedder.js";
import cors from "cors";
import "dotenv/config";

async function startServer() {
  await getEmbedder();
  const app = express();
  app.use(express.json());
  app.use(cors({ origin: "*"}));

  app.use("/api/skill", (await import("./routes/routes.js")).default);

  app.post("/api/embed", async (req, res) => {
    try {
      const { text } = req.body;
      const embedder = await getEmbedder();
      const embedding = await embedder(text, {
        pooling: "mean",
        normalize: true,
      });
      res.status(200).json({ embedding: Array.from(embedding.data) });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate embedding" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer();
