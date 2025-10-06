const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config({ path: '../.env' });

async function fixStories() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dhyey-production');
    console.log('Connected to MongoDB\n');

    const stories = await Story.find({});
    console.log(`Fixing ${stories.length} stories...\n`);
    
    for (const story of stories) {
      let updated = false;
      
      // Fix genre if undefined
      if (!story.genre || story.genre === 'undefined') {
        story.genre = 'Fiction';
        console.log(`✓ ${story.title}: Set genre to Fiction`);
        updated = true;
      }
      
      // Fix status - use valid enum value
      const validStatuses = ['draft', 'pending', 'approved', 'rejected', 'unpublished'];
      if (!story.status || !validStatuses.includes(story.status)) {
        story.status = 'approved';
        story.publishedAt = story.publishedAt || new Date();
        console.log(`✓ ${story.title}: Set status to approved`);
        updated = true;
      } else if (story.status === 'pending' || story.status === 'draft') {
        story.status = 'approved';
        story.publishedAt = story.publishedAt || new Date();
        console.log(`✓ ${story.title}: Approved story`);
        updated = true;
      }
      
      // Fix hashtags format
      if (story.hashtags && story.hashtags.length > 0) {
        const fixedHashtags = [];
        for (let tag of story.hashtags) {
          // Parse if it's a JSON string
          if (typeof tag === 'string' && tag.startsWith('[')) {
            try {
              const parsed = JSON.parse(tag);
              fixedHashtags.push(...parsed);
            } catch (e) {
              fixedHashtags.push(tag);
            }
          } else {
            fixedHashtags.push(tag);
          }
        }
        
        // Ensure all tags start with #
        story.hashtags = fixedHashtags.map(tag => {
          const clean = String(tag).trim().toLowerCase();
          return clean.startsWith('#') ? clean : `#${clean}`;
        });
        
        console.log(`✓ ${story.title}: Fixed hashtags -> ${story.hashtags.join(', ')}`);
        updated = true;
      } else {
        // Add genre-based hashtag if no hashtags
        story.hashtags = [`#${story.genre.toLowerCase().replace(/[^a-z0-9]/g, '')}`];
        console.log(`✓ ${story.title}: Added genre hashtag -> ${story.hashtags[0]}`);
        updated = true;
      }
      
      if (updated) {
        await story.save({ validateBeforeSave: false });
      }
    }
    
    console.log('\n✅ All stories fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixStories();
