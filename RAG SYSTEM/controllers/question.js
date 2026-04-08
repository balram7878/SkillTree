import { searchPinecone } from "./config/pinecone.js";
import { getEmbedder } from "../config/embedder.js";
import groq from "../config/groq.js";

const question = async (req, res) => {
  try {
    let { skill, domain, level } = req.body;
    const embedder = await getEmbedder();

    // ── Embed the domain query ───────────────────────────────
    const embedding = await embedder(domain, {
      pooling: "mean",
      normalize: true,
    });

    // ── Search Pinecone filtered by skill ────────────────────
    const rawResults = await searchPinecone(
      Array.from(embedding.data),
      skill,
      15,
    );

    if (!rawResults || rawResults.length === 0) {
      return res.status(404).json({
        message: "No relevant content found for this skill and domain.",
      });
    }

    // ── Random sample 5 from top 15 ──────────────────────────
    const shuffled = [...rawResults]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);

    const context = shuffled
      .map((chunk, i) => `[Chunk ${i + 1}]\n${chunk.text}`)
      .join("\n\n---\n\n");

    // ── Prompt ───────────────────────────────────────────────
    const prompt = `You are a strict technical interviewer evaluating a ${level}-level candidate on "${sanitizedDomain}" within the broader skill of ${skill}.

Using the context below, generate exactly 5 open-ended questions that:
- Test genuine conceptual understanding (no yes/no, no MCQ)
- Are calibrated for a ${level} level — ${
      level === "beginner"
        ? "focus on fundamentals and basic understanding"
        : level === "intermediate"
          ? "focus on application, trade-offs, and common pitfalls"
          : "focus on depth, edge cases, system design thinking, and optimization"
    }
- Are directly relevant to "${sanitizedDomain}"
- Cannot be answered by Googling a one-liner

Context:
${context}

Return ONLY a valid JSON array of 5 strings. No explanation, no markdown, no extra text.
Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    // ── Call Groq ────────────────────────────────────────────
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a technical interviewer. You respond only with valid JSON arrays. No markdown, no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8, // slightly high for question variety
      max_tokens: 1000,
    });

    const raw = response.choices[0].message.content.trim();

    // ── Safe JSON parse ──────────────────────────────────────
    let questions;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      questions = JSON.parse(cleaned);

      if (!Array.isArray(questions) || questions.length !== 5) {
        throw new Error("Invalid format");
      }
    } catch {
      return res
        .status(500)
        .json({ message: "LLM returned malformed response. Try again." });
    }

    // ── Respond ──────────────────────────────────────────────
    res.status(200).json({
      skill,
      domain: sanitizedDomain,
      level,
      questions,
    });
  } catch (error) {
    console.error("Error in /api/skill/questions:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export default question;
