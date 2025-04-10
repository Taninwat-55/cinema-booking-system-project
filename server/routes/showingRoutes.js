const express = require('express');
const router = express.Router();

const {
  getShowingsByMovieId,
  getShowingById,
} = require('../controllers/showingController');

router.get('/:id', getShowingById); 
router.get('/movie/:id', getShowingsByMovieId); 

module.exports = router;