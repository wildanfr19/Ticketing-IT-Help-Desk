const { Category } = require('../models');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description, slaHours } = req.body;

    const category = await Category.create({
      name,
      description,
      slaHours: slaHours || 24
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

module.exports = {
  getCategories,
  createCategory
};