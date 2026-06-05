const express = require("express");

const {
  fetchAllSessions,
  fetchSessionById,
} = require("../controllers/sessionController");
const validate = require("../middleware/validate");
const { sessionIdParamSchema } = require("../schemas/sessionSchemas");

const router = express.Router();

router.get("/", fetchAllSessions);
router.get("/:id", validate(sessionIdParamSchema), fetchSessionById);

module.exports = router;
