const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config({ path: '../.env' });

async function migrateHashtags() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dhyey-production');
    console.log('Connected to MongoDB');

    // Find all stories that have tags but no hashtags
    const stories = await Story.find({
      $or: [
        { hashtags: { $exists: false } },
        { hashtags: { $size: 0 } }
      ],
      tags: { $exists: true, $ne: [] }
    });

    console.log(`Found ${stories.length} stories to migrate`);

    let migratedCount = 0;
    for (const story of stories) {
      // Copy tags to hashtags, ensuring they start with #
      const hashtags = story.tags.map(tag => {
        const cleanTag = tag.trim().toLowerCase();
        return cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
      });

      story.hashtags = hashtags;
      await story.save();
      migratedCount++;
      console.log(`Migrated: ${story.title} - Added hashtags: ${hashtags.join(', ')}`);
    }

    console.log(`\n✅ Migration complete! Migrated ${migratedCount} stories.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateHashtags();
