const { sql } = require("../config/db");

const getAllSessions = async () => {
  return sql`
    SELECT
      id,
      title,
      description,
      duration_minutes,
      price,
      created_at,
      updated_at
    FROM sessions
    ORDER BY id ASC
  `;
};

const getSessionById = async (id) => {
  const sessions = await sql`
    SELECT
      id,
      title,
      description,
      duration_minutes,
      price,
      created_at,
      updated_at
    FROM sessions
    WHERE id = ${id}
  `;

  return sessions[0] || null;
};

module.exports = {
  getAllSessions,
  getSessionById,
};