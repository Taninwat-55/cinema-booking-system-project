const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'cinema.db'); 

const db = new Database(dbPath);

module.exports = db;
