import { z } from "zod";

const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be between 2 and 50 characters")
  .max(50, "Name must be between 2 and 50 characters")
  .transform((val) => val.trim().replace(/\s+/g, " "))
  .refine(
    (val) => NAME_REGEX.test(val),
    "Name can only include letters, spaces, apostrophes, and hyphens"
  );

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .transform((val) => val.trim().toLowerCase())
  .refine((val) => EMAIL_REGEX.test(val), "Enter a valid email address")
  .refine((val) => {
    const [localPart, domain] = val.split("@");
    if (!localPart || !domain || localPart.length > 64) return false;
    if (
      localPart.startsWith(".") ||
      localPart.endsWith(".") ||
      localPart.includes("..")
    )
      return false;
    if (domain.startsWith("-") || domain.endsWith("-") || domain.includes(".."))
      return false;
    return true;
  }, "Enter a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be 8-72 characters long")
  .max(72, "Password must be 8-72 characters long")
  .refine((val) => /[A-Za-z]/.test(val), "Password must contain letters")
  .refine((val) => /[0-9]/.test(val), "Password must contain a number");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
