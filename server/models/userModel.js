const pool = require('../db/database');

async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser(email, password, name) {
  const result = await pool.query(
    `INSERT INTO users (email, password, name) VALUES ($1, $2, $3)
     RETURNING user_id, email, name, is_admin`,
    [email, password, name]
  );
  return result.rows[0];
}

module.exports = { getUserByEmail, createUser };
