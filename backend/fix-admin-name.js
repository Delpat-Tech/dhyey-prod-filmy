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

const fixAdminName = async () => {
  try {
    const adminUser = await User.findOne({ email: 'admin@dhyey.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('Current admin name:', adminUser.name);
    
    // Update name to "Admin User" to match the create script
    adminUser.name = 'Admin User';
    await adminUser.save();

    console.log('✅ Admin name updated to: Admin User');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

fixAdminName();