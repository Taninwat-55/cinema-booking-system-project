const db = require('../db/database');
const seatModel = require('../models/seatModel');

function getSeatsByShowingId(req, res) {
  const showingId = req.params.id;

  const showing = seatModel.getTheaterIdByShowing(showingId);

  if (!showing) {
    return res.status(404).json({ error: 'Showing not found' });
  }

  const seats = seatModel.getSeatsByShowingId(showingId, showing.theater_id);

  res.json(seats);
}

module.exports = { getSeatsByShowingId };

// function getSeatsByShowingId(req, res) {
//   const showingId = req.params.id;

//   const showing = db
//     .prepare(
//       `
//       SELECT theater_id FROM showings WHERE showing_id = ?
//     `
//     )
//     .get(showingId);

//   if (!showing) {
//     return res.status(404).json({ error: 'Showing not found' });
//   }

//   const seats = db
//     .prepare(
//       `
//       SELECT seats.seat_id, seats.row_number, seats.seat_number,
//         CASE
//           WHEN booked_seats.seat_id IS NOT NULL THEN 0
//           ELSE 1
//         END AS is_available
//       FROM seats
//       LEFT JOIN booked_seats
//         ON seats.seat_id = booked_seats.seat_id
//         AND booked_seats.booking_id IN (
//           SELECT booking_id FROM bookings WHERE showing_id = ?
//         )
//       WHERE seats.theater_id = ?
//       ORDER BY seats.row_number, seats.seat_number
//     `
//     )
//     .all(showingId, showing.theater_id);

//   res.json(seats);
// }
