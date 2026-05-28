const bookingModel = require("../models/bookingModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingModel.findMyBookings(req.user.id);

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

const createBooking = catchAsync(async (req, res, next) => {
  const { session_id, booking_date, booking_time, notes } = req.validated.body;

  const existingBooking = await bookingModel.findBookingSlot({
    sessionId: session_id,
    bookingDate: booking_date,
    bookingTime: booking_time,
  });

  if (existingBooking) {
    return next(
      new AppError("This session is already booked for selected date and time", 409)
    );
  }

  const booking = await bookingModel.createBooking({
    userId: req.user.id,
    sessionId: session_id,
    bookingDate: booking_date,
    bookingTime: booking_time,
    notes,
  });

  res.status(201).json({
    status: "success",
    data: {
      booking,
    },
  });
});

const cancelMyBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingModel.findBookingById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.user_id !== req.user.id) {
    return next(new AppError("You can only cancel your own bookings", 403));
  }

  if (booking.status === "completed") {
    return next(new AppError("Completed booking cannot be cancelled", 400));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Booking is already cancelled", 400));
  }

  const updatedBooking = await bookingModel.updateBookingStatus({
    bookingId: req.params.id,
    status: "cancelled",
  });

  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingModel.findAllBookings();

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

const confirmBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingModel.findBookingById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Cancelled booking cannot be confirmed", 400));
  }

  if (booking.status === "completed") {
    return next(new AppError("Completed booking cannot be confirmed", 400));
  }

  const updatedBooking = await bookingModel.updateBookingStatus({
    bookingId: req.params.id,
    status: "confirmed",
  });

  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

const completeBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingModel.findBookingById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Cancelled booking cannot be completed", 400));
  }

  if (booking.status === "completed") {
    return next(new AppError("Booking is already completed", 400));
  }

  const updatedBooking = await bookingModel.updateBookingStatus({
    bookingId: req.params.id,
    status: "completed",
  });

  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

const cancelBookingAsAdmin = catchAsync(async (req, res, next) => {
  const booking = await bookingModel.findBookingById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status === "completed") {
    return next(new AppError("Completed booking cannot be cancelled", 400));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Booking is already cancelled", 400));
  }

  const updatedBooking = await bookingModel.updateBookingStatus({
    bookingId: req.params.id,
    status: "cancelled",
  });

  res.status(200).json({
    status: "success",
    data: {
      booking: updatedBooking,
    },
  });
});

module.exports = {
  getMyBookings,
  createBooking,
  cancelMyBooking,
  getAllBookings,
  confirmBooking,
  completeBooking,
  cancelBookingAsAdmin,
};