const db = require('../db/database');
const showingModel = require('../models/showingModel');

function getAllShowings(req, res) {
  const filterDate = req.query.date;

  if (filterDate) {
    const showings = showingModel.getAllShowingsByDate(filterDate);
    return res.json(showings);
  }

  const showings = showingModel.getAllShowings();
  res.json(showings);
}

function getShowingsByMovieId(req, res) {
  const movieId = req.params.id;
  const filterDate = req.query.date;

  let showings;

  if (filterDate) {
    showings = showingModel.getShowingsByMovieIdAndDate(movieId, filterDate);
  } else {
    showings = showingModel.getShowingsByMovieId(movieId);
  }

  res.json(showings);
}

function getShowingById(req, res) {
  const showingId = req.params.id;

  const showing = showingModel.getShowingById(showingId);

  if (!showing) return res.status(404).json({ error: 'Showing not found' });

  res.json(showing);
}
module.exports = {
  getShowingsByMovieId,
  getShowingById,
  getAllShowings,
};
