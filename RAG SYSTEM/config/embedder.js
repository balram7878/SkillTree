import { pipeline } from "@xenova/transformers";

let embedder = null;

export async function getEmbedder() {
  if (!embedder) {
    console.log("Loading embedding model...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("Model ready");
  }
  return embedder;
}