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

const isTodayOrFuture = (value) => {
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return value >= localToday;
};

const createBookingSchema = z.object({
  body: z.object({
    session_id: z.coerce
      .number({
        message: "Session ID is required",
      })
      .int("Session ID must be an integer")
      .positive("Session ID must be a positive number"),

    session_slot_id: z.coerce
      .number()
      .int("Session slot ID must be an integer")
      .positive("Session slot ID must be a positive number")
      .optional(),

    booking_date: z
      .string()
      .trim()
      .refine(
        isValidDate,
        "Booking date must be a valid date in YYYY-MM-DD format"
      )
      .refine(isTodayOrFuture, "Booking date cannot be in the past")
      .optional(),

    booking_time: z
      .string()
      .trim()
      .regex(timeRegex, "Booking time must use HH:mm or HH:mm:ss format")
      .optional(),

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
