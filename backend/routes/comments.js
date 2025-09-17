const express = require('express');
const router = express.Router();
const { addComment, getTicketComments } = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

// All comment routes require authentication
router.use(auth);

// @route   GET /api/comments/ticket/:ticketId
// @desc    Get all comments for a ticket
// @access  Private (Ticket owner or staff)
router.get('/ticket/:ticketId', getTicketComments);

// @route   POST /api/comments/ticket/:ticketId
// @desc    Add comment to ticket
// @access  Private (Ticket owner or staff)
router.post('/ticket/:ticketId', addComment);

module.exports = router;