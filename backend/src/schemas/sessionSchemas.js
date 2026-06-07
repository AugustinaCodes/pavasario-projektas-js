const { z } = require("zod");

const sessionBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Session title must be at least 2 characters")
    .max(100, "Session title cannot be longer than 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot be longer than 1000 characters"),
  price: z.coerce
    .number({
      message: "Price is required",
    })
    .nonnegative("Price must be zero or greater"),
  duration_minutes: z.coerce
    .number({
      message: "Duration is required",
    })
    .int("Duration must be an integer")
    .positive("Duration must be a positive number"),
  session_type: z.enum(["individual", "group"]).default("individual"),
  capacity: z.coerce
    .number()
    .int("Capacity must be an integer")
    .positive("Capacity must be a positive number")
    .default(1),
});

const createSessionSchema = z.object({
  body: sessionBodySchema,
});

const updateSessionSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "Session ID is required",
      })
      .int("Session ID must be an integer")
      .positive("Session ID must be a positive number"),
  }),
  body: sessionBodySchema,
});

const sessionIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "Session ID is required",
      })
      .int("Session ID must be an integer")
      .positive("Session ID must be a positive number"),
  }),
});

module.exports = {
  createSessionSchema,
  sessionIdParamSchema,
  updateSessionSchema,
};
