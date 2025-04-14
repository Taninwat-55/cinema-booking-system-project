const db = require('../db/database');

try {
  db.prepare(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`).run();
  console.log('✅ Column is_admin added successfully.');
} catch (err) {
  console.error('❌ Failed to add is_admin:', err.message);
}
