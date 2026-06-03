const express = require("express");

const validate = require("../middleware/validate");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createBookingSchema,
  bookingIdParamSchema,
} = require("../schemas/bookingSchemas");
const {
  fetchAllBookings,
  fetchMyBookings,
  createMyBooking,
  confirmBooking,
  completeBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.use(protect);

router.get("/", restrictTo("admin"), fetchAllBookings);
router.get("/me", fetchMyBookings);
router.post("/", validate(createBookingSchema), createMyBooking);
router.patch(
  "/:id/confirm",
  restrictTo("admin"),
  validate(bookingIdParamSchema),
  confirmBooking
);
router.patch(
  "/:id/complete",
  restrictTo("admin"),
  validate(bookingIdParamSchema),
  completeBooking
);
router.patch("/:id/cancel", validate(bookingIdParamSchema), cancelBooking);

module.exports = router;
