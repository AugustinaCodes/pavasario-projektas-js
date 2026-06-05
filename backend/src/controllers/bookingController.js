const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  getAllBookings,
  getBookingsByUserId,
  findBookingById,
  createBookingWithCapacity,
  cancelBookingForUser,
  updateBookingStatus,
} = require("../models/bookingModel");

const duplicateBookingMessage =
  "Booking already exists for this session, date and time";

const isDuplicateBookingError = (error) => {
  return (
    error.code === "23505" &&
    error.constraint === "unique_active_user_booking_time"
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
  const {
    session_id,
    session_slot_id,
    booking_date,
    booking_time,
    notes,
  } = req.validated.body;

  try {
    const result = await createBookingWithCapacity({
      userId: req.user.id,
      sessionId: session_id,
      sessionSlotId: session_slot_id,
      bookingDate: booking_date,
      bookingTime: booking_time,
      notes,
    });

    if (result.outcome === "session_not_found") {
      throw new AppError("Session not found", 404);
    }

    if (result.outcome === "duplicate_booking") {
      throw new AppError(duplicateBookingMessage, 409);
    }

    if (result.outcome === "group_slot_required") {
      throw new AppError(
        "Session slot ID is required for group sessions",
        400
      );
    }

    if (result.outcome === "slot_not_found") {
      throw new AppError("Session slot not found for this group session", 404);
    }

    if (result.outcome === "individual_slot_not_allowed") {
      throw new AppError(
        "Session slot ID cannot be used for individual sessions",
        400
      );
    }

    if (result.outcome === "individual_date_time_required") {
      throw new AppError(
        "Booking date and time are required for individual sessions",
        400
      );
    }

    if (result.outcome === "individual_unavailable") {
      throw new AppError(
        "This individual session is already booked for the selected time",
        409
      );
    }

    if (result.outcome === "group_full") {
      throw new AppError("This group session is fully booked", 409);
    }

    res.status(201).json({
      status: "success",
      data: result.booking,
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
      allowedStatuses,
    });

    if (!updatedBooking) {
      throw new AppError(errorMessage, 409);
    }

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
      allowedStatuses: ["pending", "confirmed"],
    });

    if (!cancelledBooking) {
      throw new AppError(
        "Only pending or confirmed bookings can be cancelled",
        409
      );
    }

    res.status(200).json({
      status: "success",
      data: cancelledBooking,
    });

    return;
  }

  const cancelledBooking = await cancelBookingForUser({
    bookingId: id,
    userId: req.user.id,
    allowedStatuses: ["pending", "confirmed"],
  });

  if (!cancelledBooking) {
    throw new AppError(
      "Only pending or confirmed bookings can be cancelled",
      409
    );
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
