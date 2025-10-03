const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE || 'mongodb://localhost:27017/dhyey-production';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB connection failed:', err));

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@dhyey.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update existing user to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User role updated to admin!');
      }
      
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@dhyey.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform Administrator',
      location: 'Admin Panel',
      isEmailVerified: true,
      stats: {
        storiesCount: 0,
        followersCount: 0,
        followingCount: 0,
        likesCount: 0
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@dhyey.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🛡️ Role: admin');
    console.log('');
    console.log('🚀 You can now login with these credentials and access the admin panel!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    process.exit(1);
  }
};

const updateExistingUserToAdmin = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log('✅ User updated to admin successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🛡️ Role:', user.role);
    console.log('');
    console.log('🚀 You can now login and access the admin panel!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating user role:', err);
    process.exit(1);
  }
};

// Check command line arguments
const args = process.argv.slice(2);

if (args.length > 0 && args[0] === '--update-user' && args[1]) {
  // Update existing user to admin
  updateExistingUserToAdmin(args[1]);
} else {
  // Create new admin user
  createAdminUser();
}

// Usage examples:
// node create-admin-user.js                           -> Creates new admin user
// node create-admin-user.js --update-user user@email.com -> Updates existing user to admin
