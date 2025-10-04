const Story = require('../models/Story');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadStoryImage, processStoryImage, validateImageUpload } = require('../utils/fileUpload');
const analyticsService = require('../utils/analytics');

// Image upload middleware
exports.uploadStoryImage = uploadStoryImage;
exports.processStoryImage = processStoryImage;

// Admin Methods
exports.getAllStoriesForAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;
  
  const query = {};
  
  // Filter by status if provided, default to pending stories for approval
  if (req.query.status) {
    if (req.query.status !== 'all') {
      query.status = req.query.status;
    }
    // If status is 'all', don't add any status filter to show all stories
  } else {
    // Default to pending stories when no status parameter is provided
    query.status = { $in: ['pending', 'in_review'] };
  }
  
  // Filter by genre if provided
  if (req.query.genre && req.query.genre !== 'all') {
    query.genre = req.query.genre;
  }
  
  let stories;
  let total;

  if (req.query.search) {
    // Use aggregation for author name search
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $match: {
          $or: [
            { title: { $regex: req.query.search, $options: 'i' } },
            { 'author.name': { $regex: req.query.search, $options: 'i' } }
          ]
        }
      },
      { $sort: { createdAt: -1 } }
    ];

    const totalPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Story.aggregate(totalPipeline);
    total = totalResult.length > 0 ? totalResult[0].total : 0;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    stories = await Story.aggregate(pipeline);
  } else {
    stories = await Story.find(query)
      .populate('author', 'name username avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    total = await Story.countDocuments(query);
  }

  res.status(200).json({
    status: 'success',
    results: stories.length,
    total,
    data: { stories }
  });
});

exports.approveStory = catchAsync(async (req, res, next) => {
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'approved',
      publishedAt: new Date(),
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate('author', 'name username email');

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { story }
  });
});

exports.rejectStory = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'rejected',
      rejectionReason: reason || 'Story does not meet community guidelines',
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate('author', 'name username email');

  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { story }
  });
});

exports.bulkApproveStories = catchAsync(async (req, res, next) => {
  const { storyIds } = req.body;
  
  if (!storyIds || !Array.isArray(storyIds)) {
    return next(new AppError('Please provide an array of story IDs', 400));
  }

  const result = await Story.updateMany(
    { _id: { $in: storyIds } },
    { 
      status: 'approved',
      publishedAt: new Date(),
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    }
  );

  res.status(200).json({
    status: 'success',
    message: `${result.modifiedCount} stories approved successfully`,
    data: { modifiedCount: result.modifiedCount }
  });
});

exports.bulkRejectStories = catchAsync(async (req, res, next) => {
  const { storyIds, reason } = req.body;
  
  if (!storyIds || !Array.isArray(storyIds)) {
    return next(new AppError('Please provide an array of story IDs', 400));
  }

  const result = await Story.updateMany(
    { _id: { $in: storyIds } },
    { 
      status: 'rejected',
      rejectionReason: reason || 'Stories do not meet community guidelines',
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    }
  );

  res.status(200).json({
    status: 'success',
    message: `${result.modifiedCount} stories rejected successfully`,
    data: { modifiedCount: result.modifiedCount }
  });
});

// Get single story for admin review
exports.getStoryForAdmin = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id)
    .populate('author', 'name username avatar email stats')
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

  res.status(200).json({
    status: 'success',
    data: { story }
  });
});

// Get all published stories for public feed
exports.getPublicStories = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'newest';

  const query = { status: 'approved' };
  
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

  // Only allow access to approved stories for public access (except for admins and story authors)
  if (story.status !== 'approved' && (!req.user || (req.user._id.toString() !== story.author._id.toString() && req.user.role !== 'admin'))) {
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
  const { title, content, genre, tags, hashtags, status } = req.body;
  
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
    status: status || 'pending' // Default to pending for review
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
  const story = await Story.findByIdAndDelete(req.params.id);

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


