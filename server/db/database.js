const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'cinema.db'); // Always correct path

const db = new Database(dbPath);

module.exports = db;

// const Database = require('better-sqlite3');
// const db = new Database('./db/cinema.db');

// module.exports = db;
