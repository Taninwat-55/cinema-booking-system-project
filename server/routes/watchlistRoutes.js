const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get(
  '/users/:id/watchlist',
  requireAuth,
  watchlistController.getWatchlist
);
router.post('/watchlist', requireAuth, watchlistController.addWatchlist);
router.delete('/watchlist', requireAuth, watchlistController.removeWatchlist);

module.exports = router;
