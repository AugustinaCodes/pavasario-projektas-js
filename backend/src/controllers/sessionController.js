const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  createSession,
  deleteSession,
  getAllSessions,
  getSessionById,
  updateSession,
} = require("../models/sessionModel");

const fetchAllSessions = catchAsync(async (req, res) => {
  const sessions = await getAllSessions();

  res.status(200).json({
    status: "success",
    results: sessions.length,
    data: sessions,
  });
});

const fetchSessionById = catchAsync(async (req, res) => {
  const { id: sessionId } = req.validated.params;
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: session,
  });
});

const createNewSession = catchAsync(async (req, res) => {
  const session = await createSession(req.validated.body);

  res.status(201).json({
    status: "success",
    data: {
      session,
    },
  });
});

const editSession = catchAsync(async (req, res) => {
  const { id: sessionId } = req.validated.params;
  const session = await updateSession(sessionId, req.validated.body);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      session,
    },
  });
});

const removeSession = catchAsync(async (req, res) => {
  const { id: sessionId } = req.validated.params;
  const deletedSession = await deleteSession(sessionId);

  if (!deletedSession) {
    throw new AppError("Session not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      session: deletedSession,
    },
  });
});

module.exports = {
  createNewSession,
  editSession,
  fetchAllSessions,
  fetchSessionById,
  removeSession,
};
