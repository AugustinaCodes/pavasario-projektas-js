const { z } = require("zod");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .max(255, "Email must be at most 255 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address"),

    password: z
      .string()
      .min(1, "Password is required"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};