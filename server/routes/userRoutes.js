const express = require('express');
const router = express.Router();

const { updateUser, deleteUser } = require('../controllers/userController');

const { requireAuth } = require('../middlewares/authMiddleware');

router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

module.exports = router;
