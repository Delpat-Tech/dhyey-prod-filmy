const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config({ path: '../.env' });

async function checkNewStories() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dhyey-production');
    console.log('Connected to MongoDB\n');

    const stories = await Story.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    console.log(`Latest ${stories.length} stories:\n`);
    
    stories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.title}`);
      console.log(`   Status: ${story.status}`);
      console.log(`   Genre: ${story.genre}`);
      console.log(`   Hashtags: ${JSON.stringify(story.hashtags || [])}`);
      console.log(`   Created: ${story.createdAt}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkNewStories();
