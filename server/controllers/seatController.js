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

