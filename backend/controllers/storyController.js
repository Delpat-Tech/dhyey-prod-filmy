const Story = require('../models/Story');
const User = require('../models/User');
const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadStoryImage, processStoryImage, validateImageUpload } = require('../utils/fileUpload');
const analyticsService = require('../utils/analytics');

// Image upload middleware
exports.uploadStoryImage = uploadStoryImage;
exports.processStoryImage = processStoryImage;

// Get all published stories for public feed
exports.getPublicStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'newest';

  const query = { status: 'published' };
  
  if (req.query.genre) {
    query.genre = req.query.genre;
  }

  let sort = {};
  switch (sortBy) {
    case 'popular':
      sort = { 'stats.likes': -1, 'stats.views': -1 };
      break;
    case 'trending':
      const trendingStories = await Story.getTrending(limit);
      return res.status(200).json({
        status: 'success',
        results: trendingStories.length,
        data: { stories: trendingStories }
      });
    case 'oldest':
      sort = { publishedAt: 1 };
      break;
    default:
      sort = { publishedAt: -1 };
  }

  const stories = await Story.find(query)
    .populate('author', 'name username avatar stats')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-content');

  const total = await Story.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: stories.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { stories }
  });
});

// Get single story by ID
exports.getStoryById = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id)
    .populate('author', 'name username avatar stats')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name username avatar'
      }
    });

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  // Only allow access to published stories for public access
  if (story.status !== 'published' && (!req.user || req.user._id.toString() !== story.author._id.toString())) {
    return next(new AppError('Story not available', 404));
  }

  // Track view if user is authenticated
  if (req.user) {
    await analyticsService.trackEvent(
      analyticsService.eventTypes.STORY_VIEW,
      req.user._id,
      { 
        storyId: story._id,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    );
  } else {
    // Track anonymous view
    await story.incrementView();
  }

  res.status(200).json({
    status: 'success',
    data: { story }
  });
});

// Create new story
exports.createStory = catchAsync(async (req, res, next) => {
  const { title, content, genre, tags, hashtags } = req.body;
  
  if (!title || !content || !genre) {
    return next(new AppError('Title, content, and genre are required', 400));
  }

  const storyData = {
    title,
    content,
    genre,
    tags: tags || [],
    hashtags: hashtags || [],
    author: req.user._id,
    status: 'draft'
  };

  // Add image if uploaded
  if (req.processedImages) {
    storyData.image = req.processedImages.main;
  }

  const story = await Story.create(storyData);
  await story.populate('author', 'name username avatar');

  // Update user's story count
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.storiesCount': 1 }
  });

  res.status(201).json({
    status: 'success',
    data: { story }
  });
});

// Update story
exports.updateStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  // Check if user owns the story
  if (story.author.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own stories', 403));
  }

  // Update fields
  const allowedFields = ['title', 'content', 'genre', 'tags', 'hashtags', 'status'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Add image if uploaded
  if (req.processedImages) {
    updates.image = req.processedImages.main;
  }

  const updatedStory = await Story.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('author', 'name username avatar');

  res.status(200).json({
    status: 'success',
    data: { story: updatedStory }
  });
});

// Delete story
exports.deleteStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  // Check if user owns the story or is admin
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own stories', 403));
  }

  await Story.findByIdAndDelete(req.params.id);

  // Update user's story count
  await User.findByIdAndUpdate(story.author, {
    $inc: { 'stats.storiesCount': -1 }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Like/Unlike story
exports.toggleLikeStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  await story.toggleLike(req.user._id);

  // Track analytics
  await analyticsService.trackEvent(
    analyticsService.eventTypes.STORY_LIKE,
    req.user._id,
    { storyId: story._id }
  );

  res.status(200).json({
    status: 'success',
    data: {
      isLiked: story.likedBy.includes(req.user._id),
      likesCount: story.stats.likes
    }
  });
});

// Save/Unsave story
exports.toggleSaveStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  await story.toggleSave(req.user._id);

  // Track analytics
  await analyticsService.trackEvent(
    analyticsService.eventTypes.STORY_SAVE,
    req.user._id,
    { storyId: story._id }
  );

  res.status(200).json({
    status: 'success',
    data: {
      isSaved: story.savedBy.includes(req.user._id),
      savesCount: story.stats.saves
    }
  });
});

// Share story
exports.shareStory = catchAsync(async (req, res, next) => {
  const { platform } = req.body;
  const story = await Story.findById(req.params.id);

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  // Track analytics
  await analyticsService.trackEvent(
    analyticsService.eventTypes.STORY_SHARE,
    req.user?._id,
    { storyId: story._id, platform }
  );

  res.status(200).json({
    status: 'success',
    message: 'Story shared successfully'
  });
});

// Get user's stories
exports.getUserStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const status = req.query.status || 'all';

  const query = { author: req.params.userId };
  
  if (status !== 'all') {
    query.status = status;
  }

  // If not the author or admin, only show published stories
  if (req.params.userId !== req.user?._id.toString() && req.user?.role !== 'admin') {
    query.status = 'published';
  }

  const stories = await Story.find(query)
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content');

  const total = await Story.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: stories.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { stories }
  });
});

// Search stories
exports.searchStories = catchAsync(async (req, res, next) => {
  const searchService = require('../utils/search');
  const { q, page, limit, sortBy } = req.query;

  const results = await searchService.searchStories(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sortBy: sortBy || 'relevance'
  });

  res.status(200).json({
    status: 'success',
    ...results
  });
});
