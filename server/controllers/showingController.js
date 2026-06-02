const showingModel = require('../models/showingModel');

async function getAllShowings(req, res) {
  const filterDate = req.query.date;

  if (filterDate) {
    const showings = await showingModel.getAllShowingsByDate(filterDate);
    return res.json(showings);
  }

  const showings = await showingModel.getAllShowings();
  res.json(showings);
}

async function getShowingsByMovieId(req, res) {
  const movieId = req.params.id;
  const filterDate = req.query.date;

  let showings;

  if (filterDate) {
    showings = await showingModel.getShowingsByMovieIdAndDate(movieId, filterDate);
  } else {
    showings = await showingModel.getShowingsByMovieId(movieId);
  }

  res.json(showings);
}

async function getShowingById(req, res) {
  const showingId = req.params.id;

  const showing = await showingModel.getShowingById(showingId);

  if (!showing) return res.status(404).json({ error: 'Showing not found' });

  res.json(showing);
}

module.exports = {
  getShowingsByMovieId,
  getShowingById,
  getAllShowings,
};
