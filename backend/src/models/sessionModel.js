const { sql } = require("../config/db");

const sessionSelectColumns = sql`
  s.id,
  s.title,
  s.description,
  s.duration_minutes,
  s.price,
  s.session_type,
  s.capacity,
  s.created_at,
  s.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', ss.id,
        'session_date', ss.session_date::text,
        'start_time', ss.start_time::text,
        'available_places', GREATEST(s.capacity - COALESCE(bc.booked_count, 0), 0)
      )
      ORDER BY ss.session_date, ss.start_time
    ) FILTER (WHERE ss.id IS NOT NULL),
    '[]'::json
  ) AS slots
`;

const getAllSessions = async () => {
  return sql`
    SELECT ${sessionSelectColumns}
    FROM sessions s
    LEFT JOIN session_slots ss ON ss.session_id = s.id
    LEFT JOIN (
      SELECT
        session_slot_id,
        COUNT(*)::integer AS booked_count
      FROM bookings
      WHERE status <> 'cancelled'
        AND session_slot_id IS NOT NULL
      GROUP BY session_slot_id
    ) bc ON bc.session_slot_id = ss.id
    GROUP BY s.id
    ORDER BY s.id ASC
  `;
};

const getSessionById = async (id) => {
  const sessions = await sql`
    SELECT ${sessionSelectColumns}
    FROM sessions s
    LEFT JOIN session_slots ss ON ss.session_id = s.id
    LEFT JOIN (
      SELECT
        session_slot_id,
        COUNT(*)::integer AS booked_count
      FROM bookings
      WHERE status <> 'cancelled'
        AND session_slot_id IS NOT NULL
      GROUP BY session_slot_id
    ) bc ON bc.session_slot_id = ss.id
    WHERE s.id = ${id}
    GROUP BY s.id
  `;

  return sessions[0] || null;
};

const createSession = async ({
  title,
  description,
  price,
  duration_minutes,
  session_type = "individual",
  capacity = 1,
}) => {
  const createdSessions = await sql`
    INSERT INTO sessions (
      title,
      description,
      duration_minutes,
      price,
      session_type,
      capacity
    )
    VALUES (
      ${title},
      ${description},
      ${duration_minutes},
      ${price},
      ${session_type},
      ${capacity}
    )
    RETURNING id
  `;

  return getSessionById(createdSessions[0]?.id);
};

const updateSession = async (
  id,
  { title, description, price, duration_minutes, session_type, capacity },
) => {
  const updatedSessions = await sql`
    UPDATE sessions
    SET
      title = ${title},
      description = ${description},
      price = ${price},
      duration_minutes = ${duration_minutes},
      session_type = ${session_type},
      capacity = ${capacity},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id
  `;

  if (!updatedSessions[0]) {
    return null;
  }

  return getSessionById(id);
};

const createSessionSlot = async ({ sessionId, sessionDate, startTime }) => {
  const result = await sql.begin(async (transaction) => {
    const sessions = await transaction`
      SELECT id, session_type
      FROM sessions
      WHERE id = ${sessionId}
    `;

    const session = sessions[0];

    if (!session) {
      return { outcome: "session_not_found" };
    }

    if (session.session_type !== "group") {
      return { outcome: "non_group_session" };
    }

    await transaction`
      INSERT INTO session_slots (session_id, session_date, start_time)
      VALUES (${sessionId}, ${sessionDate}, ${startTime})
    `;

    return { outcome: "created" };
  });

  if (result.outcome !== "created") {
    return result;
  }

  return {
    outcome: "created",
    session: await getSessionById(sessionId),
  };
};

const deleteSessionSlot = async ({ sessionId, slotId }) => {
  const sessions = await sql`
    SELECT id, session_type
    FROM sessions
    WHERE id = ${sessionId}
  `;

  const session = sessions[0];

  if (!session) {
    return { outcome: "session_not_found" };
  }

  if (session.session_type !== "group") {
    return { outcome: "non_group_session" };
  }

  const slots = await sql`
    SELECT id
    FROM session_slots
    WHERE id = ${slotId}
      AND session_id = ${sessionId}
  `;

  if (!slots[0]) {
    return { outcome: "slot_not_found" };
  }

  const bookings = await sql`
    SELECT COUNT(*)::integer AS count
    FROM bookings
    WHERE session_slot_id = ${slotId}
  `;

  if (bookings[0].count > 0) {
    return { outcome: "slot_has_bookings" };
  }

  await sql`
    DELETE FROM session_slots
    WHERE id = ${slotId}
      AND session_id = ${sessionId}
  `;

  return {
    outcome: "deleted",
    session: await getSessionById(sessionId),
  };
};

const deleteSession = async (id) => {
  const deletedSessions = await sql`
    DELETE FROM sessions
    WHERE id = ${id}
    RETURNING id
  `;

  return deletedSessions[0] || null;
};

module.exports = {
  createSessionSlot,
  createSession,
  deleteSessionSlot,
  deleteSession,
  getAllSessions,
  getSessionById,
  updateSession,
};
