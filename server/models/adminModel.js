const db = require('../db/database');

function getAllBookingsWithSeats() {
  const bookings = db
    .prepare(
      `
      SELECT 
        bookings.booking_id,
        bookings.booking_number,
        bookings.total_price,
        bookings.booking_time,
        users.name AS user_name,
        users.email AS user_email,
        movies.title AS movie_title,
        showings.showing_time,
        showings.theater_id
      FROM bookings
      JOIN users ON bookings.user_id = users.user_id
      JOIN showings ON bookings.showing_id = showings.showing_id
      JOIN movies ON showings.movie_id = movies.movie_id
      ORDER BY showings.showing_time DESC
    `
    )
    .all();

  const getSeats = db.prepare(`
    SELECT seat_id FROM booked_seats WHERE booking_id = ?
  `);

  return bookings.map((b) => {
    const seats = getSeats.all(b.booking_id).map((s) => s.seat_id);
    return { ...b, seats };
  });
}

module.exports = {
  getAllBookingsWithSeats,
};
