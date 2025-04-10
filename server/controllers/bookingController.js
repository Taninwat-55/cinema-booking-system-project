const db = require('../db/database');

function createBooking(req, res) {
  const { showing_id, total_price, selected_seats } = req.body;

  const user_id = null;

  const booking_number = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  const result = db
    .prepare(
      `
        INSERT INTO bookings (booking_number, user_id, showing_id, total_price)
        VALUES (?, ?, ?, ?)
    `
    )
    .run(booking_number, user_id, showing_id, total_price);

  const bookingId = result.lastInsertRowid;

  const insertBookedSeat = db.prepare(`
        INSERT INTO booked_seats (booking_id, seat_id)
        VALUES (?, ?)   
    `);

  for (const seatId of selected_seats) {
    insertBookedSeat.run(bookingId, seatId);
  }

  res.json({ message: 'Booking successfully!', booking_number });
}

module.exports = { createBooking };
