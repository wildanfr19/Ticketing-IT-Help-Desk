// const User = require('../models/User');
// const Category = require('../models/Category');
// const Priority = require('../models/Priority');
const { User, Category, Priority } = require('../models/Index');
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed Categories
    const categories = await Category.bulkCreate([
      { name: 'Hardware Issue', description: 'Computer, printer, hardware problems', slaHours: 24 },
      { name: 'Software Issue', description: 'Application, software installation problems', slaHours: 12 },
      { name: 'Network Issue', description: 'Internet, network connectivity problems', slaHours: 4 },
      { name: 'Access Request', description: 'Account, permission access requests', slaHours: 48 },
      { name: 'Email Issue', description: 'Email account, outlook problems', slaHours: 8 }
    ], { ignoreDuplicates: true });

    // Seed Priorities
    const priorities = await Priority.bulkCreate([
      { 
        name: 'Low', 
        level: 1, 
        responseTimeHours: 48, 
        resolutionTimeHours: 120, 
        colorCode: '#28a745' 
      },
      { 
        name: 'Medium', 
        level: 2, 
        responseTimeHours: 24, 
        resolutionTimeHours: 72, 
        colorCode: '#ffc107' 
      },
      { 
        name: 'High', 
        level: 3, 
        responseTimeHours: 8, 
        resolutionTimeHours: 24, 
        colorCode: '#fd7e14' 
      },
      { 
        name: 'Critical', 
        level: 4, 
        responseTimeHours: 2, 
        resolutionTimeHours: 8, 
        colorCode: '#dc3545' 
      }
    ], { ignoreDuplicates: true });

    // Seed Admin User
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@company.com' },
      defaults: {
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        fullName: 'System Administrator',
        department: 'IT Department',
        phone: '081234567890',
        role: 'admin'
      }
    });

    // Seed IT Technician
    const techUser = await User.findOrCreate({
      where: { email: 'tech@company.com' },
      defaults: {
        username: 'technician1',
        email: 'tech@company.com',
        password: 'tech123',
        fullName: 'IT Technician',
        department: 'IT Support',
        phone: '081234567891',
        role: 'technician'
      }
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Sample data:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Priorities: ${priorities.length}`);
    console.log('👤 Test accounts:');
    console.log('   - Admin: admin@company.com / admin123');
    console.log('   - Tech: tech@company.com / tech123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedDatabase;