const express = require("express");

const {
  createSlotForSession,
  createNewSession,
  deleteSlotForSession,
  fetchAllSessions,
  fetchSessionById,
  editSession,
  removeSession,
} = require("../controllers/sessionController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createSessionSlotSchema,
  createSessionSchema,
  deleteSessionSlotSchema,
  sessionIdParamSchema,
  updateSessionSchema,
} = require("../schemas/sessionSchemas");

const router = express.Router();

router.get("/", fetchAllSessions);
router.get("/:id", validate(sessionIdParamSchema), fetchSessionById);
router.post(
  "/",
  protect,
  restrictTo("admin"),
  validate(createSessionSchema),
  createNewSession,
);
router.post(
  "/:id/slots",
  protect,
  restrictTo("admin"),
  validate(createSessionSlotSchema),
  createSlotForSession,
);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  validate(updateSessionSchema),
  editSession,
);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  validate(sessionIdParamSchema),
  removeSession,
);
router.delete(
  "/:id/slots/:slotId",
  protect,
  restrictTo("admin"),
  validate(deleteSessionSlotSchema),
  deleteSlotForSession,
);

module.exports = router;
