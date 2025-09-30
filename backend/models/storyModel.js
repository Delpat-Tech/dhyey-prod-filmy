const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A story must have a title'],
    trim: true,
    maxlength: [200, 'Title must be less than 200 characters']
  },
  body: {
    type: String,
    required: [true, 'A story must have content'],
  },
  snippet: {
    type: String,
    maxlength: [300, 'Snippet must be less than 300 characters']
  },
  authorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A story must have an author']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'A story must belong to a category']
  },
  featuredImageUrl: {
    type: String,
    default: 'default-story.jpg'
  },
  hashtags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'in_review', 'published', 'rejected'],
    default: 'draft'
  },
  publishedDate: {
    type: Date
  },
  likeCount: {
    type: Number,
    default: 0
  },
  // Moderation and audit fields
  moderationHistory: [{
    action: {
      type: String,
      enum: ['approved', 'rejected', 'unpublished', 'resubmitted'],
      required: true
    },
    moderatorId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    moderatorName: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    feedback: {
      type: String // For rejection reasons or notes
    },
    previousStatus: String,
    newStatus: String
  }],
  rejectionFeedback: {
    type: String // Current rejection reason (for easy access)
  },
  lastModeratedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  lastModeratedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
storySchema.index({ authorId: 1, status: 1 });
storySchema.index({ title: 'text', authorName: 'text' });
storySchema.index({ hashtags: 1 });

// Additional indexes for admin filtering
storySchema.index({ title: 1 }); // For title search
storySchema.index({ authorName: 1 }); // For author search
storySchema.index({ status: 1 }); // For status filtering
storySchema.index({ categoryId: 1 }); // For category filtering
storySchema.index({ createdAt: -1 }); // For date sorting
storySchema.index({ likeCount: -1 }); // For popularity sorting

// Compound indexes for common query combinations
storySchema.index({ status: 1, createdAt: -1 }); // Status + date
storySchema.index({ categoryId: 1, status: 1 }); // Category + status
storySchema.index({ authorName: 1, status: 1, createdAt: -1 }); // Author + status + date

// Pre-save middleware to update snippet and publishedDate
storySchema.pre('save', function(next) {
  // Auto-generate snippet from body if not provided
  if (!this.snippet && this.body) {
    const plainText = this.body.replace(/<[^>]*>/g, ''); // Remove HTML tags
    this.snippet = plainText.substring(0, 297) + (plainText.length > 297 ? '...' : '');
  }
  
  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedDate) {
    this.publishedDate = new Date();
  }
  
  // Update updatedAt field
  this.updatedAt = new Date();
  
  next();
});

// Populate author details
storySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'authorId',
    select: 'name photo'
  });
  next();
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
