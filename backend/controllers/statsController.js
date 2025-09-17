const { Ticket, User, Category, Priority } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let whereClause = {};
    // If end user, only show their tickets
    if (role === 'end_user') {
      whereClause.requesterId = userId;
    }

    // Get ticket counts by status
    const ticketStats = await Ticket.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get priority distribution
    const priorityStats = await Ticket.findAll({
      where: whereClause,
      include: [{
        model: Priority,
        as: 'priority',
        attributes: ['name', 'level', 'color_code']
      }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'count']
      ],
      group: ['priority.id', 'priority.name', 'priority.level', 'priority.color_code'],
      raw: true
    });

    // Get category distribution
    const categoryStats = await Ticket.findAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('Ticket.id')), 'count']
      ],
      group: ['category.id', 'category.name'],
      raw: true
    });

    // Get recent tickets
    const recentTickets = await Ticket.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'requester', attributes: ['fullName'] },
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Priority, as: 'priority', attributes: ['name', 'level'] }
      ],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    // Calculate totals
    const totalTickets = await Ticket.count({ where: whereClause });
    const openTickets = await Ticket.count({ 
      where: { 
        ...whereClause, 
        status: { [Op.in]: ['new', 'assigned', 'in_progress', 'pending'] } 
      } 
    });
    const resolvedTickets = await Ticket.count({ 
      where: { ...whereClause, status: 'resolved' } 
    });
    const closedTickets = await Ticket.count({ 
      where: { ...whereClause, status: 'closed' } 
    });

    // Additional stats for admin/manager
    let userStats = null;
    if (['admin', 'manager'].includes(role)) {
      userStats = await User.findAll({
        attributes: [
          'role',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role'],
        raw: true
      });
    }

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        summary: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets,
          closed: closedTickets
        },
        ticketsByStatus: ticketStats.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {}),
        ticketsByPriority: priorityStats.map(item => ({
          name: item['priority.name'],
          level: item['priority.level'],
          color: item['priority.colorCode'],
          count: parseInt(item.count)
        })),
        ticketsByCategory: categoryStats.map(item => ({
          name: item['category.name'],
          count: parseInt(item.count)
        })),
        recentTickets,
        userStats: userStats?.reduce((acc, item) => {
          acc[item.role] = parseInt(item.count);
          return acc;
        }, {}) || null
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};

module.exports = {
  getDashboardStats
};