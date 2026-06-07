const express = require("express");

const {
  createNewSession,
  fetchAllSessions,
  fetchSessionById,
  editSession,
  removeSession,
} = require("../controllers/sessionController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createSessionSchema,
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

module.exports = router;
