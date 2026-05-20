const bcrypt = require("bcryptjs");
const { sql } = require("../config/db");

const createUser = async ({ name, email, password, role = "user" }) => {
    const hashedPassword = await bcrypt.hash(password, 12);

    const users = await sql`
    INSERT INTO users (
      name,
      email,
      password,
      role
    )
    VALUES (
      ${name},
      ${email},
      ${hashedPassword},
      ${role}
    )
    RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
  `;

    return users[0] || null;
};

const findUserByEmail = async (email) => {
    const users = await sql`
    SELECT
      id,
      name,
      email,
      password,
      role,
      created_at,
      updated_at
    FROM users
    WHERE email = ${email}
  `;

    return users[0] || null;
};

const findUserById = async (id) => {
    const users = await sql`
    SELECT
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    FROM users
    WHERE id = ${id}
  `;

    return users[0] || null;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
};