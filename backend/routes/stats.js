const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { auth } = require('../middleware/auth');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private (All authenticated users)
router.get('/dashboard', auth, getDashboardStats);

module.exports = router;