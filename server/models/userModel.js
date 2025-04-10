const db = require('../db/database');

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function createUser(email, password, name) {
  return db
    .prepare(
      `
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
  `
    )
    .run(email, password, name);
}

module.exports = { getUserByEmail, createUser };
