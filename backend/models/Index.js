const User = require('./User');
const Category = require('./Category');
const Priority = require('./Priority');
const Ticket = require('./Ticket'); 
const Comment = require('./Comment');
// const { User, Category, Priority, Ticket } = require('./models/Index');

// Define associations
// Ticket belongs to User (requester)
Ticket.belongsTo(User, { 
  foreignKey: 'requesterId', 
  as: 'requester' 
});

// Ticket belongs to User (assignee)  
Ticket.belongsTo(User, { 
  foreignKey: 'assignedTo', 
  as: 'assignee' 
});

// Ticket belongs to Category
Ticket.belongsTo(Category, { 
  foreignKey: 'categoryId', 
  as: 'category' 
});

// Ticket belongs to Priority
Ticket.belongsTo(Priority, { 
  foreignKey: 'priorityId', 
  as: 'priority' 
});

// Comment associations
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

Comment.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket'
});

// User has many tickets (as requester)
User.hasMany(Ticket, { 
  foreignKey: 'requesterId', 
  as: 'requestedTickets' 
});

// User has many tickets (as assignee)
User.hasMany(Ticket, { 
  foreignKey: 'assignedTo', 
  as: 'assignedTickets' 
});

module.exports = {
  User,
  Category, 
  Priority,
  Ticket,
  Comment
};