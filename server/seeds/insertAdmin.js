const db = require('../db/database');
const bcrypt = require('bcrypt'); // if you hash passwords

const hashedPassword = bcrypt.hashSync('adminpassword', 10);

db.prepare(`
  INSERT INTO users (email, password, name, is_admin)
  VALUES (?, ?, ?, ?)
`).run(
  'admin@email.com',
  hashedPassword,
  'Admin User',
  1 // is_admin = true
);