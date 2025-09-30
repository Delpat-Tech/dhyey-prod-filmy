const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name must be less than 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'A category must have a slug'],
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description must be less than 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to generate slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
