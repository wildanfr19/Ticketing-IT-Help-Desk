const { User } = require('../models');
const { validationResult } = require('express-validator');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'id',
                'full_name',
                'email',
                'role',
                'is_active',
                'department',
                'created_at'
            ],
            oreder: [['created_at', 'DESC']]
        })

         res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: { users }
        });
    } catch (error) {
        console.error('❌ Error getUsers:', error);
            return res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
}
// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'full_name', 'department', 'phone', 'role', 'is_active', 'created_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, department, phone, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow changing own admin status
    if (req.user.id === parseInt(id) && req.user.role === 'admin' && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own admin account'
      });
    }

    await user.update({
      fullName: fullName || user.fullName,
      department: department || user.department,
      phone: phone || user.phone,
      role: role || user.role,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'fullName', 'department', 'phone', 'role', 'isActive', 'created_at']
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
};
// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting own account
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const inactiveUsers = await User.count({ where: { isActive: false } });

    const roleStats = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    const stats = {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      roles: roleStats.reduce((acc, stat) => {
        acc[stat.role] = parseInt(stat.count);
        return acc;
      }, {})
    };

    res.json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: { stats }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
};



// Get staff users for assignment (Technicians and Managers)
const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.findAll({
      where: {
        role: ['technician', 'manager', 'admin'],
        isActive: true
      },
      attributes: ['id', 'full_name', 'email', 'role'],
      order: [['full_name', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Staff users retrieved successfully',
      data: { users: staffUsers }
    });

  } catch (error) {
    console.error('Get staff users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching staff users'
    });
  }
};


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getStaffUsers
};
