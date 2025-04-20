const db = require('../db/database');

try {
  db.prepare(
    `ALTER TABLE bookings ADD COLUMN is_cancelled INTEGER DEFAULT 0`
  ).run();
  console.log('✅ Column "is_cancelled" added to bookings table.');
} catch (err) {
  console.error('❌ Migration failed:', err.message);
}
