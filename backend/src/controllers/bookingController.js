const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getSessionById } = require("../models/sessionModel");
const {
  getAllBookings,
  getBookingsByUserId,
  findBookingById,
  findBookingSlot,
  createBooking,
  cancelBookingForUser,
  updateBookingStatus,
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

const assertStatusTransition = (booking, allowedStatuses, errorMessage) => {
  if (!allowedStatuses.includes(booking.status)) {
    throw new AppError(errorMessage, 400);
  }
};

const fetchAllBookings = catchAsync(async (req, res) => {
  const bookings = await getAllBookings();

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});

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

const updateBookingStatusForAdmin = (
  nextStatus,
  allowedStatuses,
  errorMessage
) =>
  catchAsync(async (req, res) => {
    const { id } = req.validated.params;
    const booking = await findBookingById(id);

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    assertStatusTransition(booking, allowedStatuses, errorMessage);

    const updatedBooking = await updateBookingStatus({
      bookingId: id,
      status: nextStatus,
    });

    res.status(200).json({
      status: "success",
      data: updatedBooking,
    });
  });

const confirmBooking = updateBookingStatusForAdmin(
  "confirmed",
  ["pending"],
  "Only pending bookings can be confirmed"
);

const completeBooking = updateBookingStatusForAdmin(
  "completed",
  ["confirmed"],
  "Only confirmed bookings can be completed"
);

const cancelBooking = catchAsync(async (req, res) => {
  const { id } = req.validated.params;
  const booking = await findBookingById(id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const isOwnBooking = canCancelOwnBooking(booking, req.user);

  if (req.user.role !== "admin" && !isOwnBooking) {
    throw new AppError("You can only cancel your own bookings", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  assertStatusTransition(
    booking,
    ["pending", "confirmed"],
    "Only pending or confirmed bookings can be cancelled"
  );

  if (req.user.role === "admin") {
    const cancelledBooking = await updateBookingStatus({
      bookingId: id,
      status: "cancelled",
    });

    res.status(200).json({
      status: "success",
      data: cancelledBooking,
    });

    return;
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
  fetchAllBookings,
  fetchMyBookings,
  createMyBooking,
  confirmBooking,
  completeBooking,
  cancelBooking,
};
