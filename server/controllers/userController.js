const pool = require('../db/database');

async function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  await pool.query(
    `UPDATE users SET name = $1, email = $2 WHERE user_id = $3`,
    [name, email, userId]
  );

  res.json({ message: 'User updated successfully' });
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  const bookings = await pool.query(
    `SELECT booking_id FROM bookings WHERE user_id = $1`,
    [userId]
  );

  for (const booking of bookings.rows) {
    await pool.query(`DELETE FROM booked_seats WHERE booking_id = $1`, [booking.booking_id]);
    await pool.query(`DELETE FROM booking_details WHERE booking_id = $1`, [booking.booking_id]);
    await pool.query(`DELETE FROM bookings WHERE booking_id = $1`, [booking.booking_id]);
  }

  await pool.query(`DELETE FROM watchlist WHERE user_id = $1`, [userId]);
  await pool.query(`DELETE FROM users WHERE user_id = $1`, [userId]);

  res.json({ message: 'User deleted successfully' });
}

module.exports = { updateUser, deleteUser };
