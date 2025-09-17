// backend/routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser, getUserStats, getStaffUsers } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// All user routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin/Manager only)
router.get('/', authorize('admin', 'manager'), getUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', authorize('admin'), getUserStats);
router.get('/staff', authorize('technician', 'manager', 'admin'), getStaffUsers); 

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private (Admin/Manager only)
router.get('/:id', authorize('admin', 'manager'), getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), deleteUser);



module.exports = router;