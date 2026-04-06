import express from "express";
import { generateQuestions, evaluateAnswers } from "../controllers/skill.controller.js";
import { validateQuestionsInput, validateEvaluateInput } from "../middleware/inputValidation.js";

const router = express.Router();

router.post("/questions", validateQuestionsInput, generateQuestions);
router.post("/evaluate", validateEvaluateInput, evaluateAnswers);

export default router;