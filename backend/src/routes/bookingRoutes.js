const express = require("express");

const bookingController = require("../controllers/bookingController");
const { createBookingSchema } = require("../schemas/bookingValidation");

const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router.get("/me", bookingController.getMyBookings);

router.post(
  "/",
  validate(createBookingSchema),
  bookingController.createBooking
);

router.patch("/:id/cancel", bookingController.cancelMyBooking);

router.use(restrictTo("admin"));

router.get("/", bookingController.getAllBookings);

router.patch("/:id/confirm", bookingController.confirmBooking);

router.patch("/:id/complete", bookingController.completeBooking);

router.patch("/:id/admin-cancel", bookingController.cancelBookingAsAdmin);

module.exports = router;