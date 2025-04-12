const Database = require('better-sqlite3');
const db = new Database('./db/cinema.db');

db.on('error', (err) => {
  console.error('Database error:', err);
});

module.exports = db;
