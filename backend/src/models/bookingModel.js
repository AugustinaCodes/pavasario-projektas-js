const { sql } = require("../config/db");

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
    RETURNING
      id,
      user_id,
      session_id,
      booking_date,
      booking_time,
      status,
      notes,
      created_at,
      updated_at
  `;

  return bookings[0] || null;
};

const findMyBookings = async (userId) => {
  return await sql`
    SELECT
      b.id,
      b.user_id,
      b.session_id,
      b.booking_date,
      b.booking_time,
      b.status,
      b.notes,
      b.created_at,
      b.updated_at,
      s.title AS session_title,
      s.description AS session_description,
      s.duration AS session_duration,
      s.price AS session_price
    FROM bookings b
    JOIN sessions s ON s.id = b.session_id
    WHERE b.user_id = ${userId}
    ORDER BY b.booking_date DESC, b.booking_time DESC
  `;
};

const findAllBookings = async () => {
  return await sql`
    SELECT
      b.id,
      b.user_id,
      b.session_id,
      b.booking_date,
      b.booking_time,
      b.status,
      b.notes,
      b.created_at,
      b.updated_at,
      u.name AS user_name,
      u.email AS user_email,
      s.title AS session_title,
      s.description AS session_description,
      s.duration AS session_duration,
      s.price AS session_price
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN sessions s ON s.id = b.session_id
    ORDER BY b.booking_date DESC, b.booking_time DESC
  `;
};

const findBookingById = async (bookingId) => {
  const bookings = await sql`
    SELECT
      id,
      user_id,
      session_id,
      booking_date,
      booking_time,
      status,
      notes,
      created_at,
      updated_at
    FROM bookings
    WHERE id = ${bookingId}
  `;

  return bookings[0] || null;
};

const findBookingSlot = async ({ sessionId, bookingDate, bookingTime }) => {
  const bookings = await sql`
    SELECT
      id,
      user_id,
      session_id,
      booking_date,
      booking_time,
      status
    FROM bookings
    WHERE session_id = ${sessionId}
      AND booking_date = ${bookingDate}
      AND booking_time = ${bookingTime}
      AND status != 'cancelled'
  `;

  return bookings[0] || null;
};

const updateBookingStatus = async ({ bookingId, status }) => {
  const bookings = await sql`
    UPDATE bookings
    SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${bookingId}
    RETURNING
      id,
      user_id,
      session_id,
      booking_date,
      booking_time,
      status,
      notes,
      created_at,
      updated_at
  `;

  return bookings[0] || null;
};

module.exports = {
  createBooking,
  findMyBookings,
  findAllBookings,
  findBookingById,
  findBookingSlot,
  updateBookingStatus,
};