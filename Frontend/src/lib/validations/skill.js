import { z } from "zod";

export const questionSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .refine((val) => {
      if (val.length < 3 || val.length > 100) {
        return false;
      }
      return true;
    }, "Domain must be between 3 and 100 characters")
    .refine((val) => {
      const invalidChars = /[<>$%^&*()_+=[\]{}|\\;:'",.\/?`~]/;
      return !invalidChars.test(val);
    }, "Domain contains invalid characters"),

  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({
      message: "Level must be Beginner, Intermediate, or Advanced",
    }),
  }),
});

export const answerSchema = z.object({
  answers: z.record(
    z.string(),
    z.string().min(10, "Answer too short").max(2000, "Answer too long")
  ),
});