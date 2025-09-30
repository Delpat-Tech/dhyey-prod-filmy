const multer = require('multer');
const sharp = require('sharp');
const Story = require('../models/storyModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Multer configuration for image upload
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadStoryImage = upload.single('featuredImage');

exports.resizeStoryImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `story-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(800, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/stories/${req.file.filename}`);

  next();
});

// Get all published stories for public feed
exports.getPublicStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const skip = (page - 1) * pageSize;

  // Build query for published stories only
  const query = { status: 'published' };

  // Get total count for pagination
  const totalCount = await Story.countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch stories with pagination
  const stories = await Story.find(query)
    .select('id title authorName featuredImageUrl snippet hashtags likeCount publishedDate')
    .sort({ publishedDate: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  res.status(200).json({
    data: stories,
    meta: {
      totalCount,
      pageSize,
      currentPage: page,
      totalPages
    }
  });
});

// Get single story by ID (public)
exports.getStoryById = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.storyId)
    .select('id title authorName authorId featuredImageUrl body hashtags publishedDate likeCount')
    .populate({
      path: 'authorId',
      select: 'name photo'
    });

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  // Only allow access to published stories for public access
  if (story.status !== 'published') {
    return next(new AppError('Story not available', 404));
  }

  // Format response to match API specification
  const responseData = {
    id: story._id,
    title: story.title,
    authorName: story.authorName,
    authorId: story.authorId._id,
    featuredImageUrl: story.featuredImageUrl,
    body: story.body,
    hashtags: story.hashtags,
    publishedDate: story.publishedDate,
    likeCount: story.likeCount
  };

  res.status(200).json({
    data: responseData
  });
});

// Create new story (authenticated)
exports.createStory = catchAsync(async (req, res, next) => {
  // Extract author info from authenticated user
  const authorId = req.user.id;
  const authorName = req.user.name;

  // Validate category exists if provided
  if (req.body.categoryId) {
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return next(new AppError('Invalid category ID', 400));
    }
  } else {
    // If no category provided, find a default one or create one
    let defaultCategory = await Category.findOne({ slug: 'general' });
    if (!defaultCategory) {
      defaultCategory = await Category.create({
        name: 'General',
        slug: 'general',
        description: 'General stories'
      });
    }
    req.body.categoryId = defaultCategory._id;
  }

  // Prepare story data
  const storyData = {
    ...req.body,
    authorId,
    authorName,
    status: 'in_review' // Always set to in_review for new stories
  };

  // Add featured image if uploaded
  if (req.file) {
    storyData.featuredImageUrl = req.file.filename;
  }

  const newStory = await Story.create(storyData);

  res.status(201).json({
    data: {
      id: newStory._id,
      status: newStory.status,
      message: 'Story submitted successfully for review.'
    }
  });
});

// Get user's own stories (authenticated)
exports.getUserStories = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 12;
  const skip = (page - 1) * pageSize;

  // Build query based on whether user is viewing their own profile
  let query = { authorId: userId };
  
  // If not the story owner, only show published stories
  if (!req.user || req.user.id !== userId) {
    query.status = 'published';
  }

  // Get total count for pagination
  const totalCount = await Story.countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch stories
  const stories = await Story.find(query)
    .select('id title featuredImageUrl status publishedDate')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .lean();

  res.status(200).json({
    data: stories,
    meta: {
      totalCount,
      pageSize,
      currentPage: page,
      totalPages
    }
  });
});

// Search stories
exports.searchStories = catchAsync(async (req, res, next) => {
  const { query, author, hashtag, page = 1, pageSize = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(pageSize);

  // Build search query
  let searchQuery = { status: 'published' };

  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { body: { $regex: query, $options: 'i' } }
    ];
  }

  if (author) {
    searchQuery.authorName = { $regex: author, $options: 'i' };
  }

  if (hashtag) {
    searchQuery.hashtags = hashtag.toLowerCase();
  }

  // Get total count
  const totalCount = await Story.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalCount / parseInt(pageSize));

  // Execute search
  const stories = await Story.find(searchQuery)
    .select('id title authorName featuredImageUrl snippet hashtags likeCount publishedDate')
    .sort({ publishedDate: -1 })
    .skip(skip)
    .limit(parseInt(pageSize))
    .lean();

  res.status(200).json({
    data: stories,
    meta: {
      totalCount,
      pageSize: parseInt(pageSize),
      currentPage: parseInt(page),
      totalPages
    }
  });
});

// Get all stories with advanced filtering (Admin)
exports.getAllStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  // Build query object
  let query = {};

  // Title search (case-insensitive)
  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: 'i' };
  }

  // Author search (case-insensitive)
  if (req.query.author) {
    query.authorName = { $regex: req.query.author, $options: 'i' };
  }

  // Status filter
  if (req.query.status) {
    const validStatuses = ['draft', 'in_review', 'published', 'rejected'];
    const statusQuery = req.query.status.toLowerCase().replace(/\s+/g, '_');
    
    if (validStatuses.includes(statusQuery)) {
      query.status = statusQuery;
    } else if (statusQuery === 'in_review' || req.query.status.toLowerCase() === 'in review') {
      query.status = 'in_review';
    }
  }

  // Category filter
  if (req.query.category) {
    // First find the category by name or slug
    const category = await Category.findOne({
      $or: [
        { name: { $regex: req.query.category, $options: 'i' } },
        { slug: req.query.category.toLowerCase() }
      ]
    });
    
    if (category) {
      query.categoryId = category._id;
    }
  }

  // Date range filters
  if (req.query.createdAfter) {
    query.createdAt = { ...query.createdAt, $gte: new Date(req.query.createdAfter) };
  }
  if (req.query.createdBefore) {
    query.createdAt = { ...query.createdAt, $lte: new Date(req.query.createdBefore) };
  }

  // Get total count for pagination
  const totalCount = await Story.countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Build sort object
  let sort = {};
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    sort[sortField] = sortOrder;
  } else {
    sort = { createdAt: -1 }; // Default sort by newest first
  }

  // Execute query with population
  const stories = await Story.find(query)
    .populate({
      path: 'authorId',
      select: 'name email photo'
    })
    .populate({
      path: 'categoryId',
      select: 'name slug'
    })
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .lean();

  // Format response
  const formattedStories = stories.map(story => ({
    id: story._id,
    title: story.title,
    authorName: story.authorName,
    authorEmail: story.authorId?.email,
    category: story.categoryId?.name,
    status: story.status,
    likeCount: story.likeCount,
    createdAt: story.createdAt,
    publishedDate: story.publishedDate,
    snippet: story.snippet
  }));

  res.status(200).json({
    status: 'success',
    results: formattedStories.length,
    data: formattedStories,
    meta: {
      totalCount,
      pageSize,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    filters: {
      title: req.query.title || null,
      author: req.query.author || null,
      status: req.query.status || null,
      category: req.query.category || null
    }
  });
});

// Other admin functions using factory
exports.getStory = factory.getOne(Story, { path: 'authorId categoryId' });
exports.updateStory = factory.updateOne(Story);
exports.deleteStory = factory.deleteOne(Story);
