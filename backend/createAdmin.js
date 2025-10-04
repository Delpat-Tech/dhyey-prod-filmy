const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './config.env' });

const createAdmin = async () => {
  try {
    // Connect to database
    const DB = process.env.DATABASE || 'mongodb://localhost:27017/dhyey-production';
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@dhyey.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@dhyey.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@dhyey.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@dhyey.com');
    console.log('🔑 Password: admin123');
    console.log('🔗 Login at: http://localhost:3000/auth/login');
    console.log('🛠️  Admin panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();