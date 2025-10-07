const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE || 'mongodb://localhost:27017/dhyey-production';

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB connection successful!'));

const addIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Story indexes for faster queries
    await db.collection('stories').createIndex({ status: 1, createdAt: -1 });
    await db.collection('stories').createIndex({ author: 1, createdAt: -1 });
    await db.collection('stories').createIndex({ genre: 1, status: 1 });
    await db.collection('stories').createIndex({ title: 'text', content: 'text' });
    
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    
    console.log('✅ Database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

addIndexes();