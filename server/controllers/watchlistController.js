const watchlistModel = require('../models/watchlistModel');

function getWatchlist(req, res) {
  const user_id = req.params.id;
  const watchlist = watchlistModel.getWatchlistByUserId(user_id);
  res.json(watchlist);
}

function addWatchlist(req, res) {
  const { user_id, movie_id } = req.body;

  try {
    watchlistModel.addToWatchlist(user_id, movie_id);
    res.status(201).json({ message: 'Added to watchlist' });
  } catch (error) {
    res.status(400).json({ error: 'Movie already in watchlist' });
  }
}

function removeWatchlist(req, res) {
  const { user_id, movie_id } = req.body;
  watchlistModel.removeFromWatchlist(user_id, movie_id);
  res.json({ message: 'Removed from watchlist' });
}

module.exports = {
  getWatchlist,
  addWatchlist,
  removeWatchlist,
};
