import { searchPinecone } from "../config/pinecone.js";
import { getEmbedder } from "../config/embedder.js";
import groq from "../config/groq.js";

const generateQuestions = async (req, res) => {
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
    const prompt = `You are a strict technical interviewer evaluating a ${level}-level candidate on "${domain}" within the broader skill of ${skill}.

Using the context below, generate exactly 5 open-ended questions that:
- Test genuine conceptual understanding (no yes/no, no MCQ)
- Are calibrated for a ${level} level — ${
      level === "beginner"
        ? "focus on fundamentals and basic understanding"
        : level === "intermediate"
          ? "focus on application, trade-offs, and common pitfalls"
          : "focus on depth, edge cases, system design thinking, and optimization"
    }
- Are directly relevant to "${domain}"
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
      domain: domain,
      level,
      questions,
    });
  } catch (error) {
    console.error("Error in /api/skill/questions:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

async function evaluateAnswers(req, res) {
  try {
    const { skill, domain, level, answers } = req.body;

    const formatted = answers
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join("\n\n");

    const prompt = `You are a strict but fair technical evaluator.

Evaluate ALL the following answers given by a ${level}-level candidate on "${domain}" within ${skill}.

${formatted}

For each answer evaluate based on:
- Conceptual accuracy
- Depth of understanding for a ${level} level
- Clarity of explanation
- Missing key points

Return ONLY a valid JSON array with exactly ${answers.length} objects in this format:
[
  {
    "questionIndex": 0,
    "score": <0-10>,
    "verdict": "<Excellent | Good | Average | Weak | Poor>",
    "feedback": "<2-3 sentences of honest specific feedback>",
    "gaps": ["<gap 1>", "<gap 2>"],
    "strongPoints": ["<strong point 1>"]
  }
]

No markdown, no explanation outside the JSON.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a technical evaluator. Respond only with valid JSON arrays. No markdown, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000, // bumped up — evaluating 5 answers now
    });

    const raw = response.choices[0].message.content.trim();

    let evaluations;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      evaluations = JSON.parse(cleaned);

      if (
        !Array.isArray(evaluations) ||
        evaluations.length !== answers.length
      ) {
        throw new Error("Invalid shape");
      }
    } catch {
      return res
        .status(500)
        .json({ message: "LLM returned malformed response. Try again." });
    }

    // ── Overall summary ──────────────────────────────────────
    const avgScore = (
      evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length
    ).toFixed(1);

    const allGaps = [...new Set(evaluations.flatMap((e) => e.gaps))];

    res.status(200).json({
      skill,
      domain,
      level,
      overallScore: parseFloat(avgScore),
      evaluations,
      summary: {
        totalQuestions: answers.length,
        averageScore: parseFloat(avgScore),
        topGaps: allGaps.slice(0, 5), // top 5 unique gaps across all answers
      },
    });
  } catch (error) {
    console.error("Error in evaluateAnswers:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}
export { generateQuestions, evaluateAnswers };
