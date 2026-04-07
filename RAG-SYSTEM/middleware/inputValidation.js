const VALID_SKILLS = ["web-development", "aiml"];
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

export function validateQuestionsInput(req, res, next) {
  
  let { skill, domain, level } = req.body;
  if (!skill || !domain || !level) {
    return res
      .status(400)
      .json({ message: "skill, domain, and level are required." });
  }

  skill = skill.toLowerCase().trim();
  level = level.toLowerCase().trim();
  domain = domain.trim();

  if (!VALID_SKILLS.includes(skill)) {
    return res.status(400).json({
      message: `Invalid skill. Choose from: ${VALID_SKILLS.join(", ")}`,
    });
  }

  if (!VALID_LEVELS.includes(level)) {
    return res.status(400).json({
      message: `Invalid level. Choose from: ${VALID_LEVELS.join(", ")}`,
    });
  }

  // Domain sanitization - strip special chars, enforce length
  const sanitizedDomain = domain.replace(/[^a-zA-Z0-9\s]/g, "").trim();

  if (sanitizedDomain.length < 3) {
    return res
      .status(400)
      .json({ message: "Domain too short. Minimum 3 characters." });
  }

  if (sanitizedDomain.length > 100) {
    return res
      .status(400)
      .json({ message: "Domain too long. Maximum 100 characters." });
  }

  if (sanitizedDomain.split(" ").length > 10) {
    return res
      .status(400)
      .json({ message: "Domain too verbose. Keep it concise." });
  }

  req.body.skill = skill;
  req.body.level = level;
  req.body.domain = sanitizedDomain;
  next();
}

export function validateEvaluateInput(req, res, next) {
  let { skill, domain, level, answers } = req.body;

  if (!skill || !domain || !level || !answers) {
    return res.status(400).json({ message: "skill, domain, level, and answers are required." });
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "answers must be a non-empty array." });
  }

  if (answers.length > 10) {
    return res.status(400).json({ message: "Too many answers. Maximum 10." });
  }

  for (let i = 0; i < answers.length; i++) {
    const { question, answer } = answers[i];
    if (!question || !answer) {
      return res.status(400).json({ message: `answers[${i}] is missing question or answer.` });
    }
    if (answer.trim().length < 10) {
      return res.status(400).json({ message: `answers[${i}] answer is too short.` });
    }
    if (answer.trim().length > 2000) {
      return res.status(400).json({ message: `answers[${i}] answer is too long.` });
    }
  }

  skill = skill.toLowerCase().trim();
  level = level.toLowerCase().trim();

  if (!VALID_SKILLS.includes(skill)) {
    return res.status(400).json({ message: `Invalid skill. Choose from: ${VALID_SKILLS.join(", ")}` });
  }
  if (!VALID_LEVELS.includes(level)) {
    return res.status(400).json({ message: `Invalid level. Choose from: ${VALID_LEVELS.join(", ")}` });
  }

  req.body = { skill, domain, level, answers };
  next();
}