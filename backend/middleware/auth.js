const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
         // Get user from database
        const user = await User.findByPk(decoded.userId, {
           attributes: ['id', 'username', 'email', 'fullName', 'role', 'isActive']
        });

        if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
        }

        if (!user.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Account is deactivated'
        });
        }

        // Add user to request
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login first'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { auth, authorize };