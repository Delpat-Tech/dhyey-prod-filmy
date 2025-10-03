const User = require('./../models/User');
const Story = require('./../models/Story');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { uploadAvatar, processAvatar, validateImageUpload } = require('../utils/fileUpload');
const analyticsService = require('../utils/analytics');

// Image upload middleware
exports.uploadUserPhoto = uploadAvatar;
exports.processUserPhoto = processAvatar;

// Helper function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get current user profile
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('followers', 'name username avatar')
    .populate('following', 'name username avatar');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Update current user profile
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter allowed fields
  const filteredBody = filterObj(req.body, 'name', 'username', 'bio', 'location', 'website');
  
  // 3) Add avatar if uploaded
  if (req.processedImages) {
    filteredBody.avatar = req.processedImages.main;
  }

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

// Get user profile by ID or username
exports.getUserProfile = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  
  let user;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(identifier);
  } else {
    user = await User.findOne({ username: identifier });
  }

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Follow/Unfollow user
exports.toggleFollowUser = catchAsync(async (req, res, next) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return next(new AppError('You cannot follow yourself', 400));
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return next(new AppError('User not found', 404));
  }

  await analyticsService.trackEvent(
    analyticsService.eventTypes.USER_FOLLOW,
    currentUserId,
    { followedUserId: targetUserId }
  );

  const isFollowing = targetUser.followers.includes(currentUserId);

  res.status(200).json({
    status: 'success',
    data: {
      isFollowing: !isFollowing,
      followersCount: targetUser.stats.followersCount
    }
  });
});

// Get user's followers
exports.getUserFollowers = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const user = await User.findById(userId)
    .populate({
      path: 'followers',
      select: 'name username avatar bio stats',
      options: {
        skip,
        limit,
        sort: { createdAt: -1 }
      }
    });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const total = user.stats.followersCount;

  res.status(200).json({
    status: 'success',
    results: user.followers.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { followers: user.followers }
  });
});

// Get user's following
exports.getUserFollowing = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  const user = await User.findById(userId)
    .populate({
      path: 'following',
      select: 'name username avatar bio stats',
      options: {
        skip,
        limit,
        sort: { createdAt: -1 }
      }
    });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const total = user.stats.followingCount;

  res.status(200).json({
    status: 'success',
    results: user.following.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { following: user.following }
  });
});

// Get user's saved stories
exports.getUserSavedStories = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;

  // Check if user is requesting their own saved stories
  if (userId !== req.user._id.toString()) {
    return next(new AppError('You can only view your own saved stories', 403));
  }

  const savedStories = await Story.find({
    savedBy: userId,
    status: 'published'
  })
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content');

  const total = await Story.countDocuments({
    savedBy: userId,
    status: 'published'
  });

  res.status(200).json({
    status: 'success',
    results: savedStories.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { stories: savedStories }
  });
});

// Get all users (admin)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .select('-password -refreshTokens');

  const total = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { users }
  });
});

// Admin Methods
exports.getAllUsersForAdmin = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;
  
  const query = {};
  
  // Filter by status if provided
  if (req.query.status && req.query.status !== 'all') {
    query.status = req.query.status;
  }
  
  // Filter by role if provided
  if (req.query.role && req.query.role !== 'all') {
    query.role = req.query.role;
  }
  
  // Search functionality
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password -passwordResetToken -passwordResetExpires')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: users.length,
    total,
    data: { users }
  });
});

exports.suspendUser = catchAsync(async (req, res, next) => {
  const { reason, duration } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'suspended',
      suspensionReason: reason || 'Suspended by admin',
      suspendedBy: req.user.id,
      suspendedAt: new Date(),
      suspensionDuration: duration // in days
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.unsuspendUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'active',
      $unset: { 
        suspensionReason: 1,
        suspendedBy: 1,
        suspendedAt: 1,
        suspensionDuration: 1
      }
    },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Delete user's stories
  await Story.deleteMany({ author: req.params.id });

  // Delete the user
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
