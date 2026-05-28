const { z } = require("zod");

const createBookingSchema = z.object({
  body: z.object({
    session_id: z.coerce
      .number()
      .int()
      .positive("Session id must be a positive number"),

    booking_date: z
      .string()
      .min(1, "Booking date is required")
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Booking date must be in YYYY-MM-DD format"
      ),

    booking_time: z
      .string()
      .min(1, "Booking time is required")
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Booking time must be in HH:mm format"
      ),

    notes: z
      .string()
      .max(500, "Notes cannot be longer than 500 characters")
      .optional()
      .or(z.literal("")),
  }),
});

module.exports = {
  createBookingSchema,
};