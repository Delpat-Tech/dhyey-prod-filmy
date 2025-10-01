const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment cannot be empty'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author']
  },
  story: {
    type: mongoose.Schema.ObjectId,
    ref: 'Story',
    required: [true, 'Comment must belong to a story']
  },
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  // Moderation
  isHidden: {
    type: Boolean,
    default: false
  },
  moderationReason: {
    type: String
  },
  moderatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
commentSchema.index({ story: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id'
});

// Update story comment count when comment is saved
commentSchema.post('save', async function() {
  if (!this.parentComment) { // Only count top-level comments
    const Story = mongoose.model('Story');
    const commentCount = await this.constructor.countDocuments({ 
      story: this.story, 
      parentComment: null,
      isHidden: false 
    });
    await Story.findByIdAndUpdate(this.story, { 'stats.comments': commentCount });
  }
});

// Update story comment count when comment is removed
commentSchema.post('remove', async function() {
  if (!this.parentComment) { // Only count top-level comments
    const Story = mongoose.model('Story');
    const commentCount = await this.constructor.countDocuments({ 
      story: this.story, 
      parentComment: null,
      isHidden: false 
    });
    await Story.findByIdAndUpdate(this.story, { 'stats.comments': commentCount });
  }
});

// Update likes count when likedBy changes
commentSchema.pre('save', function(next) {
  if (this.isModified('likedBy')) {
    this.likes = this.likedBy.length;
  }
  next();
});

// Set editedAt when content is modified
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Instance method to toggle like
commentSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likedBy.indexOf(userId);
  
  if (likeIndex > -1) {
    this.likedBy.splice(likeIndex, 1);
  } else {
    this.likedBy.push(userId);
  }
  
  return this.save({ validateBeforeSave: false });
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
