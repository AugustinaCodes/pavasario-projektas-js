const { z } = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot be longer than 50 characters")
  .regex(
    /^[A-Za-zÀ-ž\s'-]+$/,
    "Name can only contain letters, spaces, hyphens and apostrophes"
  );

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot be longer than 64 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 
    "Password must include at least one uppercase letter, one lowercase letter, one number and one special character"
  );

const registerSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Invalid email address"),

    password: z.string().min(1, "Password is required"),
  }),
});

const updateProfileSchema = z.object({
  body: z
    .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
      currentPassword: z.string().min(1, "Current password is required").optional(),
      password: passwordSchema.optional(),
    })
    .refine(
      (data) => data.name !== undefined || data.email !== undefined || data.password !== undefined,
      {
        message: "At least one field must be provided",
      }
    )
    .superRefine((data, ctx) => {
      if (data.password && !data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currentPassword"],
          message: "Current password is required when changing your password",
        });
      }
    }),
});

module.exports = {
  updateProfileSchema,
  registerSchema,
  loginSchema,
};
