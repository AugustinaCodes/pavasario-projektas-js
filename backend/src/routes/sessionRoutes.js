const express = require("express");

const {
  fetchAllSessions,
  fetchSessionById,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", fetchAllSessions);
router.get("/:id", fetchSessionById);

module.exports = router;