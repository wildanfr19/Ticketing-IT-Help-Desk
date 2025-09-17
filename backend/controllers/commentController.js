const { Comment, User, Ticket } = require('../models');

// Add comment to ticket
const addComment = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { commentText, isInternal = false } = req.body;

    // Check if ticket exists
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    const isStaff = ['technician', 'manager', 'admin'].includes(req.user.role);
    const isOwner = ticket.requesterId === req.user.id;

    if (!isStaff && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only staff can create internal comments
    const finalIsInternal = isStaff ? isInternal : false;

    const comment = await Comment.create({
      ticketId: parseInt(ticketId),
      userId: req.user.id,
      commentText,
      isInternal: finalIsInternal
    });

    // Get comment with author details
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'fullName', 'email', 'role'] 
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: createdComment }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
};

// Get comments for a ticket
const getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if ticket exists and user has access
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const isStaff = ['technician', 'manager', 'admin'].includes(req.user.role);
    const isOwner = ticket.requesterId === req.user.id;

    if (!isStaff && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Build where clause based on user role
    let whereClause = { ticketId: parseInt(ticketId) };
    
    // Non-staff users can't see internal comments
    if (!isStaff) {
      whereClause.isInternal = false;
    }

    const comments = await Comment.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'author', 
          attributes: ['id', 'fullName', 'email', 'role'] 
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: { comments }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error // kirim objek error agar frontend bisa baca detailnya
    });
  }
};

module.exports = {
  addComment,
  getTicketComments
};