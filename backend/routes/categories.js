const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all active categories
// @access  Private (All authenticated users)
router.get('/', auth, getCategories);

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createCategory);

module.exports = router;