const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config({ path: '../.env' });

async function approveStories() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dhyey-production');
    console.log('Connected to MongoDB');
    
    const result = await Story.updateMany(
      { status: 'pending' },
      { 
        $set: { 
          status: 'approved',
          publishedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Approved ${result.modifiedCount} pending stories`);
    
    // Also add hashtags from genre
    const stories = await Story.find({ status: 'approved', $or: [{ hashtags: { $size: 0 } }, { hashtags: { $exists: false } }] });
    console.log(`\nAdding genre-based hashtags to ${stories.length} stories...`);
    
    for (const story of stories) {
      const genreTag = `#${story.genre.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      story.hashtags = [genreTag];
      await story.save();
      console.log(`  ${story.title} -> ${genreTag}`);
    }
    
    console.log('\n✅ All done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

approveStories();
