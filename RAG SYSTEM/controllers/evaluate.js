export async function evaluateAnswer(req, res) {
  try {
    const { skill, domain, level, question, answer } = req.body;

    // ── Prompt ───────────────────────────────────────────────
    const prompt = `You are a strict but fair technical evaluator.

Evaluate the following answer given by a ${level}-level candidate.

Skill: ${skill}
Domain: ${domain}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate based on:
- Conceptual accuracy
- Depth of understanding for a ${level} level
- Clarity of explanation
- Missing key points

Return ONLY a valid JSON object in this exact format:
{
  "score": <number from 0 to 10>,
  "verdict": "<Excellent | Good | Average | Weak | Poor>",
  "feedback": "<2-3 sentences of honest specific feedback>",
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "strongPoints": ["<strong point 1>", "<strong point 2>"]
}

No markdown, no explanation outside the JSON.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a technical evaluator. You respond only with valid JSON. No markdown, no extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // low temp — evaluation needs consistency not creativity
      max_tokens: 600,
    });

    const raw = response.choices[0].message.content.trim();

    let evaluation;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      evaluation = JSON.parse(cleaned);

      // basic shape validation
      if (
        typeof evaluation.score !== "number" ||
        !evaluation.verdict ||
        !evaluation.feedback ||
        !Array.isArray(evaluation.gaps) ||
        !Array.isArray(evaluation.strongPoints)
      ) {
        throw new Error("Invalid shape");
      }
    } catch {
      return res.status(500).json({ message: "LLM returned malformed response. Try again." });
    }

    res.status(200).json({
      skill,
      domain,
      level,
      question,
      evaluation,
    });

  } catch (error) {
    console.error("Error in evaluateAnswer:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}