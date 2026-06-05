const { sql } = require("../config/db");

const getAllSessions = async () => {
  return sql`
    SELECT
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
    SELECT
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

module.exports = {
  getAllSessions,
  getSessionById,
};
