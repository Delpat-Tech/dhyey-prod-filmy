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

const updateUserStatus = async () => {
  try {
    // Update all users without status field to have 'active' status
    const result = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with active status`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating user status:', err);
    process.exit(1);
  }
};

updateUserStatus();