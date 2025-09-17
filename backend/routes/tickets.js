const express = require('express');
const router = express.Router();
const { createTicketValidation } = require('../middleware/validation');
const { createTicket, getTickets, updateTicketStatus, getTicketById, assignTicket } = require('../controllers/ticketController');

const { auth, authorize } = require('../middleware/auth');

router.use(auth);

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private (All authenticated users)
router.post('/', createTicketValidation, createTicket);

// @route   GET /api/tickets
// @desc    Get tickets (filtered based on user role)
// @access  Private (All authenticated users)
router.get('/', getTickets);

// @route   GET /api/tickets/:id
// @desc    Get single ticket by ID
// @access  Private (Ticket owner or staff)
router.get('/:id', getTicketById);

// @route   PUT /api/tickets/:id/status
// @desc    Update ticket status
// @access  Private (Technician, Manager, Admin only)
router.put('/:id/status', authorize('technician', 'manager', 'admin'), updateTicketStatus);

router.put('/:id/assign', authorize('technician', 'manager', 'admin'), assignTicket);

module.exports = router;