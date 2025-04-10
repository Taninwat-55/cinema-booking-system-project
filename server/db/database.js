const Database = require('better-sqlite3');
const db = new Database('./db/cinema.db');

module.exports = db;
