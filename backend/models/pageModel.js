const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A page must have a title'],
    trim: true,
    maxlength: [200, 'Title must be less than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'A page must have a slug'],
    unique: true,
    lowercase: true,
    trim: true
  },
  body: {
    type: String,
    required: [true, 'A page must have content']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description must be less than 160 characters']
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

// Index for better performance
pageSchema.index({ slug: 1, isPublished: 1 });

// Pre-save middleware to update lastUpdated
pageSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = new Date();
  }
  next();
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
