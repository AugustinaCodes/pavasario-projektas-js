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

const createBookingSchema = z.object({
  body: z.object({
    session_id: z.coerce
      .number({
        message: "Session ID is required",
      })
      .int("Session ID must be an integer")
      .positive("Session ID must be a positive number"),

    booking_date: z
      .string({
        message: "Booking date is required",
      })
      .trim()
      .refine(
        isValidDate,
        "Booking date must be a valid date in YYYY-MM-DD format"
      ),

    booking_time: z
      .string({
        message: "Booking time is required",
      })
      .trim()
      .regex(timeRegex, "Booking time must use HH:mm or HH:mm:ss format"),

    notes: z
      .string()
      .trim()
      .max(1000, "Notes must be at most 1000 characters")
      .optional(),
  }),
});

const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({
        message: "Booking ID is required",
      })
      .int("Booking ID must be an integer")
      .positive("Booking ID must be a positive number"),
  }),
});

module.exports = {
  createBookingSchema,
  bookingIdParamSchema,
};
