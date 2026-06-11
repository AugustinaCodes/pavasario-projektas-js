const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  createSessionSlot,
  createSession,
  deleteSessionSlot,
  deleteSession,
  getAllSessions,
  getSessionById,
  updateSession,
} = require("../models/sessionModel");

const isDuplicateSessionSlotError = (error) =>
  error.code === "23505" && error.constraint === "unique_session_slot";

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

const createSlotForSession = catchAsync(async (req, res) => {
  const { id: sessionId } = req.validated.params;
  const { session_date, start_time } = req.validated.body;

  try {
    const result = await createSessionSlot({
      sessionId,
      sessionDate: session_date,
      startTime: start_time,
    });

    if (result.outcome === "session_not_found") {
      throw new AppError("Session not found", 404);
    }

    if (result.outcome === "non_group_session") {
      throw new AppError("Session slots can only be added to group sessions", 400);
    }

    res.status(201).json({
      status: "success",
      data: {
        session: result.session,
      },
    });
  } catch (error) {
    if (isDuplicateSessionSlotError(error)) {
      throw new AppError("A slot already exists for this session date and time", 409);
    }

    throw error;
  }
});

const deleteSlotForSession = catchAsync(async (req, res) => {
  const { id: sessionId, slotId } = req.validated.params;
  const result = await deleteSessionSlot({ sessionId, slotId });

  if (result.outcome === "session_not_found") {
    throw new AppError("Session not found", 404);
  }

  if (result.outcome === "non_group_session") {
    throw new AppError("Session slots can only be managed for group sessions", 400);
  }

  if (result.outcome === "slot_not_found") {
    throw new AppError("Session slot not found for this group session", 404);
  }

  if (result.outcome === "slot_has_bookings") {
    throw new AppError("Cannot delete a session slot that has bookings", 409);
  }

  res.status(200).json({
    status: "success",
    data: {
      session: result.session,
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
  createSlotForSession,
  createNewSession,
  deleteSlotForSession,
  editSession,
  fetchAllSessions,
  fetchSessionById,
  removeSession,
};
