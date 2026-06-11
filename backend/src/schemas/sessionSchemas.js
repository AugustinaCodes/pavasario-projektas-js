const { z } = require("zod");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const isValidDate = (value) => {
  if (!dateRegex.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const isTodayOrFutureSlot = ({ session_date, start_time }) => {
  const slotDateTime = new Date(`${session_date}T${start_time}`);

  return !Number.isNaN(slotDateTime.getTime()) && slotDateTime >= new Date();
};

const sessionIdSchema = z.coerce
  .number({
    message: "Session ID is required",
  })
  .int("Session ID must be an integer")
  .positive("Session ID must be a positive number");

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
    id: sessionIdSchema,
  }),
  body: sessionBodySchema,
});

const sessionIdParamSchema = z.object({
  params: z.object({
    id: sessionIdSchema,
  }),
});

const createSessionSlotSchema = z.object({
  params: z.object({
    id: sessionIdSchema,
  }),
  body: z
    .object({
      session_date: z
        .string()
        .trim()
        .refine(
          isValidDate,
          "Session slot date must be a valid date in YYYY-MM-DD format"
        ),
      start_time: z
        .string()
        .trim()
        .regex(timeRegex, "Session slot time must use HH:mm or HH:mm:ss format"),
    })
    .refine(isTodayOrFutureSlot, {
      message: "Session slot cannot be in the past",
      path: ["session_date"],
    }),
});

const deleteSessionSlotSchema = z.object({
  params: z.object({
    id: sessionIdSchema,
    slotId: z.coerce
      .number({
        message: "Session slot ID is required",
      })
      .int("Session slot ID must be an integer")
      .positive("Session slot ID must be a positive number"),
  }),
});

module.exports = {
  createSessionSlotSchema,
  createSessionSchema,
  deleteSessionSlotSchema,
  sessionIdParamSchema,
  updateSessionSchema,
};
