const { sql } = require("../config/db");

const bookingResponseSelect = sql`
  SELECT
    b.id,
    b.user_id,
    b.session_id,
    b.session_slot_id,
    s.title AS session_title,
    s.session_type,
    b.booking_date::text AS booking_date,
    b.booking_time::text AS booking_time,
    b.status,
    b.notes,
    s.price,
    b.created_at,
    b.updated_at
  FROM bookings b
  JOIN sessions s ON s.id = b.session_id
`;

const adminBookingResponseSelect = sql`
  SELECT
    b.id,
    b.user_id,
    u.name AS user_name,
    u.email AS user_email,
    b.session_id,
    b.session_slot_id,
    s.title AS session_title,
    s.session_type,
    b.booking_date::text AS booking_date,
    b.booking_time::text AS booking_time,
    b.status,
    b.notes,
    s.price,
    b.created_at,
    b.updated_at
  FROM bookings b
  JOIN users u ON u.id = b.user_id
  JOIN sessions s ON s.id = b.session_id
`;

const getAllBookings = async () => {
  return sql`
    ${adminBookingResponseSelect}
    ORDER BY b.booking_date ASC, b.booking_time ASC, b.id ASC
  `;
};

const getBookingsByUserId = async (userId) => {
  return sql`
    ${bookingResponseSelect}
    WHERE b.user_id = ${userId}
    ORDER BY b.booking_date ASC, b.booking_time ASC, b.id ASC
  `;
};

const findBookingById = async (id) => {
  const bookings = await sql`
    SELECT
      id,
      user_id,
      session_id,
      session_slot_id,
      booking_date::text AS booking_date,
      booking_time::text AS booking_time,
      status,
      notes,
      created_at,
      updated_at
    FROM bookings
    WHERE id = ${id}
  `;

  return bookings[0] || null;
};

const getBookingResponseById = async (id) => {
  const bookings = await sql`
    ${bookingResponseSelect}
    WHERE b.id = ${id}
  `;

  return bookings[0] || null;
};

const getAdminBookingResponseById = async (id) => {
  const bookings = await sql`
    ${adminBookingResponseSelect}
    WHERE b.id = ${id}
  `;

  return bookings[0] || null;
};

const createBookingWithCapacity = async ({
  userId,
  sessionId,
  sessionSlotId,
  bookingDate,
  bookingTime,
  notes,
}) => {
  const result = await sql.begin(async (transaction) => {
    const sessions = await transaction`
      SELECT
        id,
        session_type,
        capacity,
        duration_minutes
      FROM sessions
      WHERE id = ${sessionId}
      FOR UPDATE
    `;

    const session = sessions[0];

    if (!session) {
      return { outcome: "session_not_found" };
    }

    let resolvedSlotId = null;
    let resolvedBookingDate = bookingDate;
    let resolvedBookingTime = bookingTime;

    if (session.session_type === "group") {
      if (!sessionSlotId) {
        return { outcome: "group_slot_required" };
      }

      const slots = await transaction`
        SELECT
          id,
          session_date::text AS session_date,
          start_time::text AS start_time
        FROM session_slots
        WHERE id = ${sessionSlotId}
          AND session_id = ${sessionId}
          AND (
            session_date > CURRENT_DATE
            OR (
              session_date = CURRENT_DATE
              AND start_time >= LOCALTIME
            )
          )
        FOR UPDATE
      `;

      const slot = slots[0];

      if (!slot) {
        return { outcome: "slot_not_found" };
      }

      resolvedSlotId = slot.id;
      resolvedBookingDate = slot.session_date;
      resolvedBookingTime = slot.start_time;
    } else {
      if (sessionSlotId) {
        return { outcome: "individual_slot_not_allowed" };
      }

      if (!bookingDate || !bookingTime) {
        return { outcome: "individual_date_time_required" };
      }
    }

    const duplicateBookings = await transaction`
      SELECT id
      FROM bookings
      WHERE user_id = ${userId}
        AND session_id = ${sessionId}
        AND booking_date = ${resolvedBookingDate}
        AND booking_time = ${resolvedBookingTime}
        AND status <> 'cancelled'
      LIMIT 1
    `;

    if (duplicateBookings[0]) {
      return { outcome: "duplicate_booking" };
    }

    if (session.session_type === "group") {
      const activeBookings = await transaction`
        SELECT COUNT(*)::integer AS count
        FROM bookings
        WHERE session_slot_id = ${resolvedSlotId}
          AND status <> 'cancelled'
      `;

      if (activeBookings[0].count >= session.capacity) {
        return { outcome: "group_full" };
      }
    } else {
      const overlappingBookings = await transaction`
        SELECT id
        FROM bookings b
        WHERE b.session_id = ${sessionId}
          AND b.status <> 'cancelled'
          AND (b.booking_date + b.booking_time) <
            (
              ${resolvedBookingDate}::date + ${resolvedBookingTime}::time +
              (${session.duration_minutes} * INTERVAL '1 minute')
            )
          AND (${resolvedBookingDate}::date + ${resolvedBookingTime}::time) <
            (
              b.booking_date + b.booking_time +
              (${session.duration_minutes} * INTERVAL '1 minute')
            )
        LIMIT 1
      `;

      if (overlappingBookings[0]) {
        return { outcome: "individual_unavailable" };
      }
    }

    const bookings = await transaction`
      INSERT INTO bookings (
        user_id,
        session_id,
        session_slot_id,
        booking_date,
        booking_time,
        notes
      )
      VALUES (
        ${userId},
        ${sessionId},
        ${resolvedSlotId},
        ${resolvedBookingDate},
        ${resolvedBookingTime},
        ${notes || null}
      )
      RETURNING id
    `;

    return {
      outcome: "created",
      bookingId: bookings[0].id,
    };
  });

  if (result.outcome !== "created") {
    return result;
  }

  return {
    outcome: result.outcome,
    booking: await getBookingResponseById(result.bookingId),
  };
};

const updateBookingStatus = async ({
  bookingId,
  status,
  allowedStatuses,
}) => {
  const bookings = await sql`
    UPDATE bookings
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${bookingId}
      AND status IN ${sql(allowedStatuses)}
    RETURNING id
  `;

  if (!bookings[0]) {
    return null;
  }

  return getAdminBookingResponseById(bookings[0].id);
};

const cancelBookingForUser = async ({
  bookingId,
  userId,
  allowedStatuses,
}) => {
  const bookings = await sql`
    UPDATE bookings
    SET
      status = 'cancelled',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${bookingId}
      AND user_id = ${userId}
      AND status IN ${sql(allowedStatuses)}
    RETURNING id
  `;

  if (!bookings[0]) {
    return null;
  }

  return getBookingResponseById(bookings[0].id);
};

module.exports = {
  getAllBookings,
  getBookingsByUserId,
  findBookingById,
  createBookingWithCapacity,
  updateBookingStatus,
  cancelBookingForUser,
};
