const express = require('express');
const router = express.Router();
const { getPriorities } = require('../controllers/priorityController');
const { auth } = require('../middleware/auth');

// @route   GET /api/priorities
// @desc    Get all priorities
// @access  Private (All authenticated users)
router.get('/', auth, getPriorities);

module.exports = router;