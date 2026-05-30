const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getSessionById } = require("../models/sessionModel");
const {
  getBookingsByUserId,
  findBookingById,
  findBookingSlot,
  createBooking,
  cancelBookingForUser,
} = require("../models/bookingModel");

const duplicateBookingMessage =
  "Booking already exists for this session, date and time";

const isDuplicateBookingError = (error) => {
  return (
    error.code === "23505" &&
    error.constraint === "unique_session_booking_time"
  );
};

const canCancelOwnBooking = (booking, user) => booking.user_id === user.id;

const fetchMyBookings = catchAsync(async (req, res) => {
  const bookings = await getBookingsByUserId(req.user.id);

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

const createMyBooking = catchAsync(async (req, res) => {
  const { session_id, booking_date, booking_time, notes } = req.validated.body;

  const session = await getSessionById(session_id);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  const existingBooking = await findBookingSlot(
    session_id,
    booking_date,
    booking_time
  );

  if (existingBooking) {
    throw new AppError(duplicateBookingMessage, 409);
  }

  try {
    const booking = await createBooking({
      userId: req.user.id,
      sessionId: session_id,
      bookingDate: booking_date,
      bookingTime: booking_time,
      notes,
    });

    res.status(201).json({
      status: "success",
      data: booking,
    });
  } catch (error) {
    if (isDuplicateBookingError(error)) {
      throw new AppError(duplicateBookingMessage, 409);
    }

    throw error;
  }
});

const cancelMyBooking = catchAsync(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await findBookingById(id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const isOwnBooking = canCancelOwnBooking(booking, req.user);

  if (!isOwnBooking) {
    // PAV-35 can add req.user.role === "admin" handling here.
    throw new AppError("You can only cancel your own bookings", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  const cancelledBooking = await cancelBookingForUser({
    bookingId: id,
    userId: req.user.id,
  });

  if (!cancelledBooking) {
    throw new AppError("Booking not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: cancelledBooking,
  });
});

module.exports = {
  fetchMyBookings,
  createMyBooking,
  cancelMyBooking,
};
