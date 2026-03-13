const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const normalizeName = (name) => String(name).trim().replace(/\s+/g, " ");
const normalizeEmail = (email) => String(email).trim().toLowerCase();

const validateName = (name) => {
  if (typeof name !== "string") {
    return { isValid: false, message: "Name must be a string" };
  }

  const normalized = normalizeName(name);

  if (!normalized) {
    return { isValid: false, message: "Name is required" };
  }

  if (normalized.length < 2 || normalized.length > 50) {
    return {
      isValid: false,
      message: "Name must be between 2 and 50 characters",
    };
  }

  if (!NAME_REGEX.test(normalized)) {
    return {
      isValid: false,
      message:
        "Name can only include letters, spaces, apostrophes, and hyphens",
    };
  }

  return { isValid: true, normalized };
};

const validateEmail = (email) => {
  if (typeof email !== "string") {
    return { isValid: false, message: "Email must be a string" };
  }

  const normalized = normalizeEmail(email);

  if (!normalized) {
    return { isValid: false, message: "Email is required" };
  }

  if (normalized.length > 254) {
    return { isValid: false, message: "Email is too long" };
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return { isValid: false, message: "Enter a valid email address" };
  }

  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain || localPart.length > 64) {
    return { isValid: false, message: "Enter a valid email address" };
  }

  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return { isValid: false, message: "Enter a valid email address" };
  }

  if (domain.startsWith("-") || domain.endsWith("-") || domain.includes("..")) {
    return { isValid: false, message: "Enter a valid email address" };
  }

  return { isValid: true, normalized };
};

const validatePassword = (password) => {
  if (typeof password !== "string") {
    return { isValid: false, message: "Password must be a string" };
  }

  if (password.length < 8 || password.length > 72) {
    return {
      isValid: false,
      message: "Password must be 8-72 characters long",
    };
  }

  if (!/[A-Za-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain letters",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain a number",
    };
  }



  return { isValid: true };
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
};