const pool = require('../db/database');

async function getSeatsByShowingId(showingId, theaterId) {
  const result = await pool.query(
    `SELECT seats.seat_id, seats.row_number, seats.seat_number,
      CASE
        WHEN booked_seats.seat_id IS NOT NULL THEN 0
        ELSE 1
      END AS is_available
    FROM seats
    LEFT JOIN booked_seats
      ON seats.seat_id = booked_seats.seat_id
      AND booked_seats.booking_id IN (
        SELECT booking_id FROM bookings WHERE showing_id = $1
      )
    WHERE seats.theater_id = $2
    ORDER BY seats.row_number, seats.seat_number`,
    [showingId, theaterId]
  );
  return result.rows;
}

async function getTheaterIdByShowing(showingId) {
  const result = await pool.query(
    `SELECT theater_id FROM showings WHERE showing_id = $1`,
    [showingId]
  );
  return result.rows[0];
}

module.exports = { getSeatsByShowingId, getTheaterIdByShowing };
