const seatModel = require('../models/seatModel');

async function getSeatsByShowingId(req, res) {
  const showingId = req.params.id;

  const showing = await seatModel.getTheaterIdByShowing(showingId);

  if (!showing) {
    return res.status(404).json({ error: 'Showing not found' });
  }

  const seats = await seatModel.getSeatsByShowingId(showingId, showing.theater_id);

  res.json(seats);
}

module.exports = { getSeatsByShowingId };
