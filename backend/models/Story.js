const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A story must have a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'A story must have content'],
    minlength: [100, 'Story content must be at least 100 characters']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A story must have an author']
  },
  genre: {
    type: String,
    required: [true, 'A story must have a genre'],
    enum: ['Fiction', 'Non-Fiction', 'Poetry', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Drama', 'Horror', 'Comedy', 'Adventure', 'Biography']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  hashtags: [{
    type: String,
    trim: true,
    lowercase: true,
    match: [/^#\w+$/, 'Hashtags must start with # and contain only letters, numbers, and underscores']
  }],
  image: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'unpublished'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  // User interactions
  likedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  savedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  // Moderation
  moderationNotes: {
    type: String
  },
  moderatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  // SEO and search
  slug: {
    type: String,
    unique: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  // Analytics
  viewHistory: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    readingTime: Number, // in seconds
    completed: {
      type: Boolean,
      default: false
    }
  }],
  // Featured story
  featured: {
    type: Boolean,
    default: false
  },
  featuredAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
});

// Indexes for performance
storySchema.index({ author: 1, status: 1 });
storySchema.index({ genre: 1, status: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ 'stats.views': -1 });
storySchema.index({ 'stats.likes': -1 });
storySchema.index({ publishedAt: -1 });
storySchema.index({ slug: 1 });
storySchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for comments
storySchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'story',
  localField: '_id'
});

// Generate slug before saving
storySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now();
  }
  next();
});

// Calculate read time before saving
storySchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Generate excerpt if not provided
    if (!this.excerpt) {
      this.excerpt = this.content.substring(0, 200) + '...';
    }
  }
  next();
});

// Update published date when status changes to approved
storySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Update stats when arrays change
storySchema.pre('save', function(next) {
  if (this.isModified('likedBy')) {
    this.stats.likes = this.likedBy.length;
  }
  if (this.isModified('savedBy')) {
    this.stats.saves = this.savedBy.length;
  }
  next();
});



// Static method to get trending stories
storySchema.statics.getTrending = function(limit = 10) {
  return this.aggregate([
    {
      $match: { status: 'approved' }
    },
    {
      $addFields: {
        trendingScore: {
          $add: [
            { $multiply: ['$stats.views', 0.1] },
            { $multiply: ['$stats.likes', 2] },
            { $multiply: ['$stats.comments', 3] },
            { $multiply: ['$stats.shares', 5] }
          ]
        }
      }
    },
    {
      $sort: { trendingScore: -1, publishedAt: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: '$author'
    }
  ]);
};

// Instance method to increment view count
storySchema.methods.incrementView = function(userId = null, readingTime = 0, completed = false) {
  this.stats.views += 1;
  
  if (userId) {
    // Check if user already viewed this story recently (within 24 hours)
    const recentView = this.viewHistory.find(view => 
      view.user && view.user.toString() === userId.toString() && 
      Date.now() - view.viewedAt.getTime() < 24 * 60 * 60 * 1000
    );
    
    if (!recentView) {
      this.viewHistory.push({
        user: userId,
        readingTime,
        completed
      });
    }
  }
  
  return this.save({ validateBeforeSave: false });
};

// Instance method to toggle like - REMOVED
// This method was causing double-toggle issues with the controller
// The controller now handles like toggling directly with atomic operations

// Instance method to toggle save - DISABLED
// This method was causing double-toggle issues
// storySchema.methods.toggleSave = async function(userId) { ... }

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
