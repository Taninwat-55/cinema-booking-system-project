const db = require('../db/database');

function createBooking(
  bookingNumber,
  userId,
  showingId,
  bookingTime,
  totalPrice
) {
  return db
    .prepare(
      `
      INSERT INTO bookings (booking_number, user_id, showing_id, booking_time, total_price)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(bookingNumber, userId, showingId, bookingTime, totalPrice);
}

function getBookingsByUserId(userId) {
  return db
    .prepare(
      `
    SELECT 
      bookings.booking_id,
      bookings.booking_number,
      showings.showing_id,
      movies.title AS movie_title,
      showings.showing_time
    FROM bookings
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    WHERE bookings.user_id = ?
  `
    )
    .all(userId);
}

function getSeatsByBookingId(bookingId) {
  return db
    .prepare(
      `
        SELECT seats.row_number || seats.seat_number AS seat_label
        FROM booked_seats
        JOIN seats ON booked_seats.seat_id = seats.seat_id
        WHERE booked_seats.booking_id = ?
      `
    )
    .all(bookingId);
}

module.exports = { getBookingsByUserId, getSeatsByBookingId, createBooking };
