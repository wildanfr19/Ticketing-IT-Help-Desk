const { Priority } = require('../models/Index');

// Get all priorities
const getPriorities = async (req, res) => {
  try {
    const priorities = await Priority.findAll({
      order: [['level', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Priorities retrieved successfully',
      data: { priorities }
    });

  } catch (error) {
    console.error('Get priorities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching priorities'
    });
  }
};

module.exports = {
  getPriorities
};