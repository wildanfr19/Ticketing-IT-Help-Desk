const { validationResult } = require('express-validator');
// const Ticket = require('../models/Ticket');
// const User = require('../models/User');
// const Category = require('../models/Category');
// const Priority = require('../models/Priority');
const { Ticket, User, Category, Priority } = require('../models/Index');

// Create new ticket
const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, categoryId, priorityId } = req.body;

    // Calculate due date based on category SLA
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + category.slaHours);

    const now = new Date();
    const ticketNumber = `TCKT-${now.getFullYear()}${(now.getMonth()+1)
    .toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${now.getHours()
    .toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      categoryId,
      priorityId,
      requesterId: req.user.id,
      dueDate
    });

    // Get ticket with relations
    const createdTicket = await Ticket.findByPk(ticket.id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Priority, as: 'priority', attributes: ['id', 'name', 'level'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: { ticket: createdTicket }
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: error.message, 
      error: error 
    });
  }
};

// Get all tickets (with filtering)
const getTickets = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    
    let where = {};
    
    // Apply filters
    if (status) where.status = status;
    if (category) where.categoryId = category;
    if (priority) where.priorityId = priority;
    
    // If user is end_user, only show their tickets
    if (req.user.role === 'end_user') {
      where.requesterId = req.user.id;
    }

    const offset = (page - 1) * limit;

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where,
      include: [
        { model: User, as: 'requester', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Priority, as: 'priority', attributes: ['id', 'name', 'level','color_code'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      message: 'Tickets retrieved successfully',
      data: {
        tickets,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: error.message, // tampilkan pesan error asli
      error: error // tampilkan objek error
    });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNotes } = req.body;

    // Check if user has permission
    if (!['technician', 'manager', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Prepare update data
    const updateData = { status };
    
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
    
    // Set resolved/closed timestamps
    if (status === 'resolved' && ticket.status !== 'resolved') {
      updateData.resolvedAt = new Date();
    }
    if (status === 'closed' && ticket.status !== 'closed') {
      updateData.closedAt = new Date();
    }

    await ticket.update(updateData);

    // Get updated ticket with relations
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Priority, as: 'priority', attributes: ['id', 'name', 'level'] }
      ]
    });

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: { ticket: updatedTicket }
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating ticket'
    });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'fullName', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Priority, as: 'priority', attributes: ['id', 'name', 'level', 'color_code'] }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permission - users can only see their own tickets unless they're staff
    if (req.user.role === 'end_user' && ticket.requesterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      message: 'Ticket retrieved successfully',
      data: { ticket }
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ticket'
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  getTicketById
};