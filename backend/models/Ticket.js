const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
  ticketNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'ticket_number'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'assigned', 'in_progress', 'pending', 'resolved', 'closed'),
    defaultValue: 'new'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category_id'
  },
  priorityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'priority_id'
  },
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'requester_id'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_to'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'resolved_at'
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'closed_at'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'due_date'
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'resolution_notes'
  }
}, {
  tableName: 'tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

Ticket.beforeCreate(async (ticket) => {
    const Year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

      // Get last ticket number for this month
    const lastTicket = await Ticket.findOne({
        where: {
        ticketNumber: {
            [sequelize.Sequelize.Op.like]: `TK${Year}${month}%`
        }
        },
        order: [['ticketNumber', 'DESC']]
    });
    let nextNumber = 1;
    if (lastTicket) {
        const lastNumber = parseInt(lastTicket.ticketNumber.slice(-4));
        nextNumber = lastNumber + 1;
    }
     ticket.ticketNumber = `TK${Year}${month}${String(nextNumber).padStart(4, '0')}`;
})

module.exports = Ticket;