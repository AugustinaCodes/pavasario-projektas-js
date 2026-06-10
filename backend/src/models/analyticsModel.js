const { sql } = require("../config/db");

const getAdminAnalytics = async () => {
  const [summary] = await sql`
    SELECT
      COUNT(*)::integer AS total_users,
      COUNT(*) FILTER (WHERE role = 'admin')::integer AS admin_users,
      COUNT(*) FILTER (WHERE role = 'user')::integer AS regular_users,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days')::integer AS new_users_last_30_days,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::integer AS new_users_last_7_days,
      (SELECT COUNT(*)::integer FROM sessions) AS total_sessions,
      (SELECT COUNT(*)::integer FROM sessions WHERE session_type = 'individual') AS individual_sessions,
      (SELECT COUNT(*)::integer FROM sessions WHERE session_type = 'group') AS group_sessions,
      (SELECT COUNT(*)::integer FROM bookings) AS total_bookings,
      (SELECT COUNT(*)::integer FROM bookings WHERE status = 'pending') AS pending_bookings,
      (SELECT COUNT(*)::integer FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
      (SELECT COUNT(*)::integer FROM bookings WHERE status = 'completed') AS completed_bookings,
      (SELECT COUNT(*)::integer FROM bookings WHERE status = 'cancelled') AS cancelled_bookings
    FROM users
  `;

  const bookingsByStatus = await sql`
    SELECT
      status_labels.label,
      status_labels.sort_order,
      COALESCE(COUNT(b.id), 0)::integer AS value
    FROM (
      VALUES
        ('Pending', 'pending', 1),
        ('Confirmed', 'confirmed', 2),
        ('Completed', 'completed', 3),
        ('Cancelled', 'cancelled', 4)
    ) AS status_labels(label, status, sort_order)
    LEFT JOIN bookings b
      ON b.status = status_labels.status
    GROUP BY status_labels.label, status_labels.sort_order
    ORDER BY status_labels.sort_order
  `;

  const topSessions = await sql`
    SELECT
      s.title AS label,
      COUNT(b.id)::integer AS value,
      COUNT(*) FILTER (WHERE b.status = 'completed')::integer AS completed,
      s.session_type,
      s.capacity
    FROM sessions s
    LEFT JOIN bookings b
      ON b.session_id = s.id
     AND b.status <> 'cancelled'
    GROUP BY s.id, s.title, s.session_type, s.capacity
    ORDER BY value DESC, s.title ASC
    LIMIT 5
  `;

  const userGrowth = await sql`
    SELECT
      to_char(day::date, 'Mon DD') AS label,
      day::date AS sort_date,
      COALESCE(COUNT(u.id), 0)::integer AS value
    FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS day
    LEFT JOIN users u
      ON u.created_at::date = day::date
    GROUP BY day
    ORDER BY day
  `;

  const bookingTrend = await sql`
    SELECT
      to_char(day::date, 'Mon DD') AS label,
      day::date AS sort_date,
      COALESCE(COUNT(b.id), 0)::integer AS value
    FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS day
    LEFT JOIN bookings b
      ON b.booking_date = day::date
    GROUP BY day
    ORDER BY day
  `;

  return {
    summary: summary || {},
    bookingsByStatus,
    topSessions,
    userGrowth,
    bookingTrend,
  };
};

const getMyAnalytics = async (userId) => {
  const [summary] = await sql`
    SELECT
      COUNT(*)::integer AS total_bookings,
      COUNT(*) FILTER (WHERE status = 'pending')::integer AS pending_bookings,
      COUNT(*) FILTER (WHERE status = 'confirmed')::integer AS confirmed_bookings,
      COUNT(*) FILTER (WHERE status = 'completed')::integer AS completed_bookings,
      COUNT(*) FILTER (WHERE status = 'cancelled')::integer AS cancelled_bookings,
      COUNT(*) FILTER (
        WHERE status IN ('pending', 'confirmed')
          AND booking_date >= CURRENT_DATE
      )::integer AS upcoming_bookings,
      COUNT(*) FILTER (WHERE status <> 'cancelled')::integer AS active_bookings,
      ROUND(
        (
          COUNT(*) FILTER (WHERE status = 'completed')::numeric /
          NULLIF(COUNT(*) FILTER (WHERE status <> 'cancelled'), 0)
        ) * 100,
        1
      ) AS attendance_rate
    FROM bookings
    WHERE user_id = ${userId}
  `;

  const bookingsByStatus = await sql`
    SELECT
      status_labels.label,
      status_labels.sort_order,
      COALESCE(COUNT(b.id), 0)::integer AS value
    FROM (
      VALUES
        ('Pending', 'pending', 1),
        ('Confirmed', 'confirmed', 2),
        ('Completed', 'completed', 3),
        ('Cancelled', 'cancelled', 4)
    ) AS status_labels(label, status, sort_order)
    LEFT JOIN bookings b
      ON b.user_id = ${userId}
     AND b.status = status_labels.status
    GROUP BY status_labels.label, status_labels.sort_order
    ORDER BY status_labels.sort_order
  `;

  const recentBookings = await sql`
    SELECT
      to_char(day::date, 'Mon DD') AS label,
      day::date AS sort_date,
      COALESCE(COUNT(b.id), 0)::integer AS value
    FROM generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    ) AS day
    LEFT JOIN bookings b
      ON b.user_id = ${userId}
     AND b.booking_date = day::date
    GROUP BY day
    ORDER BY day
  `;

  const favoriteSessions = await sql`
    SELECT
      s.title AS label,
      COUNT(b.id)::integer AS value,
      COUNT(*) FILTER (WHERE b.status = 'completed')::integer AS completed
    FROM bookings b
    JOIN sessions s
      ON s.id = b.session_id
    WHERE b.user_id = ${userId}
    GROUP BY s.id, s.title
    ORDER BY value DESC, s.title ASC
    LIMIT 5
  `;

  return {
    summary: summary || {},
    bookingsByStatus,
    recentBookings,
    favoriteSessions,
  };
};

module.exports = {
  getAdminAnalytics,
  getMyAnalytics,
};