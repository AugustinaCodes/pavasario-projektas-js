const express = require("express");

const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const {
  createBookingSchema,
  bookingIdParamSchema,
} = require("../schemas/bookingSchemas");
const {
  fetchMyBookings,
  createMyBooking,
  cancelMyBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.use(protect);

router.get("/me", fetchMyBookings);
router.post("/", validate(createBookingSchema), createMyBooking);
router.patch("/:id/cancel", validate(bookingIdParamSchema), cancelMyBooking);

module.exports = router;
