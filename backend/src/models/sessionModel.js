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

const deleteSession = async (id) => {
  const deletedSessions = await sql`
    DELETE FROM sessions
    WHERE id = ${id}
    RETURNING id
  `;

  return deletedSessions[0] || null;
};

module.exports = {
  createSession,
  deleteSession,
  getAllSessions,
  getSessionById,
  updateSession,
};
