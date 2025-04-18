const db = require('../db/database');

function getSeatsByShowingId(showingId, theaterId) {
  return db
    .prepare(
      `
      SELECT seats.seat_id, seats.row_number, seats.seat_number,
        CASE
          WHEN booked_seats.seat_id IS NOT NULL THEN 0
          ELSE 1
        END AS is_available
      FROM seats
      LEFT JOIN booked_seats
        ON seats.seat_id = booked_seats.seat_id
        AND booked_seats.booking_id IN (
          SELECT booking_id FROM bookings WHERE showing_id = ?
        )
      WHERE seats.theater_id = ?
      ORDER BY seats.row_number, seats.seat_number
    `
    )
    .all(showingId, theaterId);
}

function getTheaterIdByShowing(showingId) {
  return db
    .prepare(`SELECT theater_id FROM showings WHERE showing_id = ?`)
    .get(showingId);
}

module.exports = {
  getSeatsByShowingId,
  getTheaterIdByShowing,
};
