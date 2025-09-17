const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Priority = sequelize.define('Priority', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  responseTimeHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'response_time_hours'
  },
  resolutionTimeHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'resolution_time_hours'
  },
  colorCode: {
    type: DataTypes.STRING(7),
    allowNull: true,
    field: 'color_code'
  }
}, {
  tableName: 'priorities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
module.exports = Priority;