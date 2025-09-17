// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5050;

const sequelize = require('./config/database');
// const { Ticket, User, Category, Priority } = require('./models');
const User = require('./models/User');
const Category = require('./models/Category');
const Priority = require('./models/Priority');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');
const seedDatabase = require('./seeders/seedData');


sequelize.sync({ force: false }) // Set true untuk recreate tables
  .then(() => {
    console.log('📋 Database tables synced');
  })
  .catch(err => {
    console.error('❌ Database sync error:', err);
  });

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect to database:', err);
  });

  //seeders
  // sequelize.sync({ force: false })
  // .then(async () => {
  //   console.log('📋 Database tables synced');
    
  //   // Seed database with sample data
  //   await seedDatabase();
  // })
  // .catch(err => {
  //   console.error('❌ Database sync error:', err);
  // });
// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'IT Ticketing System API', 
    version: '1.0.0',
    status: 'running'
  });
});

// Routes (akan kita tambahkan nanti)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/priorities', require('./routes/priorities'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/comments', require('./routes/comments'));
// app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;