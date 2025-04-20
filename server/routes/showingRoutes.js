const express = require('express');
const router = express.Router();

const {
  getShowingsByMovieId,
  getShowingById,
  getAllShowings,
} = require('../controllers/showingController');

router.get('/', getAllShowings);
router.get('/:id', getShowingById);
router.get('/movie/:id', getShowingsByMovieId);

module.exports = router;
