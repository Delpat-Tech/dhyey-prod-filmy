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

const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@dhyey.com' });
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      process.exit(0);
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      username: 'testuser',
      email: 'test@dhyey.com',
      password: 'password123',
      bio: 'This is a test user for development purposes.',
      location: 'Test City, Test Country',
      website: 'testuser.com',
      isEmailVerified: true,
      stats: {
        storiesCount: 5,
        followersCount: 100,
        followingCount: 50,
        likesCount: 250
      }
    });

    console.log('Test user created successfully!');
    console.log('Email:', testUser.email);
    console.log('Password: password123');
    console.log('Username:', testUser.username);
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
};

createTestUser();