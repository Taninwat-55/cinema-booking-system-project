const db = require('../db/database');

function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  db.prepare(
    `
      UPDATE users SET name = ?, email = ? WHERE user_id = ?
    `
  ).run(name, email, userId);

  res.json({ message: 'User updated successfully' });
}

function deleteUser(req, res) {
  const userId = req.params.id;

  // 1. Get all user's bookings
  const bookings = db
    .prepare(`SELECT booking_id FROM bookings WHERE user_id = ?`)
    .all(userId);

  const deleteBookedSeats = db.prepare(
    `DELETE FROM booked_seats WHERE booking_id = ?`
  );
  const deleteBookingDetails = db.prepare(
    `DELETE FROM booking_details WHERE booking_id = ?`
  );
  const deleteBooking = db.prepare(`DELETE FROM bookings WHERE booking_id = ?`);

  for (const booking of bookings) {
    deleteBookedSeats.run(booking.booking_id);
    deleteBookingDetails.run(booking.booking_id);
    deleteBooking.run(booking.booking_id);
  }

  // 2. Delete user’s watchlist entries
  db.prepare(`DELETE FROM watchlist WHERE user_id = ?`).run(userId);

  // 3. Finally, delete the user
  db.prepare(`DELETE FROM users WHERE user_id = ?`).run(userId);

  res.json({ message: 'User deleted successfully' });
}

module.exports = { updateUser, deleteUser };
