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
      bookings.total_price,
      bookings.booking_time,
      showings.showing_id,
      showings.showing_time, -- this is full TIMESTAMP
      movies.title AS movie_title,
      movies.poster_url
    FROM bookings
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    WHERE bookings.user_id = ?
    ORDER BY showings.showing_time ASC
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

function deletePastBookings() {
  const oldBookings = db
    .prepare(
      `
    SELECT booking_id FROM bookings 
    WHERE booking_time < CURRENT_TIMESTAMP
  `
    )
    .all();

  const deleteBookedSeats = db.prepare(`
    DELETE FROM booked_seats WHERE booking_id = ?
  `);
  const deleteBookingDetails = db.prepare(`
    DELETE FROM booking_details WHERE booking_id = ?
  `);
  const deleteBooking = db.prepare(`
    DELETE FROM bookings WHERE booking_id = ?
  `);

  for (const { booking_id } of oldBookings) {
    deleteBookedSeats.run(booking_id);
    deleteBookingDetails.run(booking_id);
    deleteBooking.run(booking_id);
  }
}

function insertBookedSeats(bookingId, seatIds) {
  const stmt = db.prepare(`
    INSERT INTO booked_seats (booking_id, seat_id)
    VALUES (?, ?)
  `);

  for (const seatId of seatIds) {
    stmt.run(bookingId, seatId);
  }
}

function insertBookingDetails(bookingId, details) {
  const stmt = db.prepare(`
    INSERT INTO booking_details (booking_id, ticket_type, quantity, price_per_ticket)
    VALUES (?, ?, ?, ?)
  `);

  for (const detail of details) {
    stmt.run(
      bookingId,
      detail.ticket_type,
      detail.quantity,
      detail.price_per_ticket
    );
  }
}

function getBookingByNumber(bookingNumber) {
  return db
    .prepare(
      `
    SELECT bookings.*, movies.title AS movie_title, movies.poster_url, showings.showing_time
    FROM bookings
    JOIN showings ON bookings.showing_id = showings.showing_id
    JOIN movies ON showings.movie_id = movies.movie_id
    WHERE bookings.booking_number = ?
  `
    )
    .get(bookingNumber);
}

function trackBookingByNumber(bookingNumber) {
  const booking = db
    .prepare(
      `
    SELECT b.booking_id, b.booking_number, b.total_price, b.showing_id,
           s.showing_time, m.title, m.poster_url, m.duration
    FROM bookings b
    JOIN showings s ON b.showing_id = s.showing_id
    JOIN movies m ON s.movie_id = m.movie_id
    WHERE b.booking_number = ?
  `
    )
    .get(bookingNumber);

  if (!booking) return null;

  const seats = db
    .prepare(
      `
    SELECT seat_row, seat_column FROM booked_seats WHERE booking_id = ?
  `
    )
    .all(booking.booking_id);

  return { ...booking, seats };
}

module.exports = {
  getBookingsByUserId,
  getSeatsByBookingId,
  createBooking,
  deletePastBookings,
  insertBookedSeats,
  insertBookingDetails,
  getBookingByNumber,
  trackBookingByNumber
};
