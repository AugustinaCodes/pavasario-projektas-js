const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getAllSessions, getSessionById } = require("../models/sessionModel");

const fetchAllSessions = catchAsync(async (req, res) => {
  const sessions = await getAllSessions();

  res.status(200).json({
    status: "success",
    results: sessions.length,
    data: sessions,
  });
});

const fetchSessionById = catchAsync(async (req, res) => {
  const sessionId = Number(req.params.id);
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: session,
  });
});

module.exports = {
  fetchAllSessions,
  fetchSessionById,
};