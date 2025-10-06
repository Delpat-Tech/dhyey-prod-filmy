const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config({ path: '../.env' });

async function checkStories() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dhyey-production');
    console.log('Connected to MongoDB\n');

    const allStories = await Story.find({}).limit(10).lean();
    console.log(`Total stories in DB: ${allStories.length}\n`);

    const stories = allStories;
    console.log(`Showing all stories:\n`);
    
    stories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.title}`);
      console.log(`   Genre: ${story.genre}`);
      console.log(`   Tags: ${JSON.stringify(story.tags || [])}`);
      console.log(`   Hashtags: ${JSON.stringify(story.hashtags || [])}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkStories();
