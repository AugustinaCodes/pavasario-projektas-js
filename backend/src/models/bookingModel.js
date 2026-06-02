const { sql } = require("../config/db");

const bookingResponseSelect = sql`
  SELECT
    b.id,
    b.user_id,
    b.session_id,
    s.title AS session_title,
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

const findBookingSlot = async (sessionId, bookingDate, bookingTime) => {
  const bookings = await sql`
    SELECT
      id,
      user_id,
      session_id,
      booking_date::text AS booking_date,
      booking_time::text AS booking_time,
      status
    FROM bookings
    WHERE session_id = ${sessionId}
      AND booking_date = ${bookingDate}
      AND booking_time = ${bookingTime}
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

const createBooking = async ({
  userId,
  sessionId,
  bookingDate,
  bookingTime,
  notes,
}) => {
  const bookings = await sql`
    INSERT INTO bookings (
      user_id,
      session_id,
      booking_date,
      booking_time,
      notes
    )
    VALUES (
      ${userId},
      ${sessionId},
      ${bookingDate},
      ${bookingTime},
      ${notes || null}
    )
    RETURNING id
  `;

  return getBookingResponseById(bookings[0].id);
};

const updateBookingStatus = async ({ bookingId, status }) => {
  const bookings = await sql`
    UPDATE bookings
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${bookingId}
    RETURNING id
  `;

  if (!bookings[0]) {
    return null;
  }

  return getBookingResponseById(bookings[0].id);
};

const cancelBookingForUser = async ({ bookingId, userId }) => {
  const bookings = await sql`
    UPDATE bookings
    SET
      status = 'cancelled',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${bookingId}
      AND user_id = ${userId}
    RETURNING id
  `;

  if (!bookings[0]) {
    return null;
  }

  return getBookingResponseById(bookings[0].id);
};

module.exports = {
  getBookingsByUserId,
  findBookingById,
  findBookingSlot,
  createBooking,
  updateBookingStatus,
  cancelBookingForUser,
};
