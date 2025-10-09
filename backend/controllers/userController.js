const mongoose = require('mongoose');
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

  console.log('Get saved stories - User ID:', userId, 'Requesting user:', req.user._id.toString());

  // Check if user is requesting their own saved stories
  if (userId !== req.user._id.toString()) {
    return next(new AppError('You can only view your own saved stories', 403));
  }

  const query = {
    savedBy: { $in: [new mongoose.Types.ObjectId(userId)] }
  };
  console.log('Query for saved stories:', query);

  const savedStories = await Story.find(query)
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-content');

  console.log('Found saved stories:', savedStories.length);

  const total = await Story.countDocuments({
    savedBy: { $in: [new mongoose.Types.ObjectId(userId)] }
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

// Get all admin users
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } })
    .select('-password -passwordResetToken -passwordResetExpires -refreshTokens')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: { admins }
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
  
  // Prevent self-suspension
  if (req.params.id === req.user.id) {
    return next(new AppError('You cannot suspend yourself', 400));
  }
  
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  // Prevent suspending the main admin user
  if (user.email === 'admin@dhyey.com') {
    return next(new AppError('Cannot suspend the main administrator account', 403));
  }
  
  const updatedUser = await User.findByIdAndUpdate(
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

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
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

// Dashboard Analytics
exports.getDashboardAnalytics = catchAsync(async (req, res, next) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  
  // Get current counts
  const totalUsers = await User.countDocuments();
  const totalStories = await Story.countDocuments();
  const totalViews = await Story.aggregate([
    { $group: { _id: null, total: { $sum: '$stats.views' } } }
  ]);
  const totalLikes = await Story.aggregate([
    { $group: { _id: null, total: { $sum: '$stats.likes' } } }
  ]);
  
  // Get last month counts for comparison
  const lastMonthUsers = await User.countDocuments({ createdAt: { $lt: lastMonth } });
  const lastMonthStories = await Story.countDocuments({ createdAt: { $lt: lastMonth } });
  
  // Calculate changes
  const userChange = lastMonthUsers > 0 ? ((totalUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;
  const storyChange = lastMonthStories > 0 ? ((totalStories - lastMonthStories) / lastMonthStories * 100) : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      overview: {
        totalUsers: { 
          value: totalUsers, 
          change: Math.round(userChange * 10) / 10, 
          trend: userChange >= 0 ? 'up' : 'down' 
        },
        totalStories: { 
          value: totalStories, 
          change: Math.round(storyChange * 10) / 10, 
          trend: storyChange >= 0 ? 'up' : 'down' 
        },
        totalViews: { 
          value: totalViews[0]?.total || 0, 
          change: 23.1, 
          trend: 'up' 
        },
        engagementRate: { 
          value: totalLikes[0]?.total || 0, 
          change: -2.3, 
          trend: 'down' 
        }
      }
    }
  });
});

// Dashboard Stats
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Get current counts
  const regularUsers = await User.countDocuments({ role: 'user', status: { $ne: 'suspended' } }); // Active regular users only
  const suspendedUsers = await User.countDocuments({ status: 'suspended' });
  const adminUsers = await User.countDocuments({ role: { $in: ['admin', 'super_admin', 'moderator'] } });
  const totalAllUsers = await User.countDocuments(); // All users including admins
  const totalUsers = regularUsers; // For backward compatibility
  const totalStories = await Story.countDocuments();
  const totalViews = await Story.aggregate([
    { $group: { _id: null, total: { $sum: '$stats.views' } } }
  ]);
  const totalLikes = await Story.aggregate([
    { $group: { _id: null, total: { $sum: '$stats.likes' } } }
  ]);
  
  // Get active users (logged in within last 24 hours)
  const activeUsers = await User.countDocuments({ 
    lastActive: { $gte: last24Hours } 
  });
  
  // Get pending reviews
  const pendingReviews = await Story.countDocuments({ status: 'pending' });
  
  // Get today's submissions
  const todaySubmissions = await Story.countDocuments({
    createdAt: { $gte: startOfToday }
  });
  
  // Get last week's data for comparison
  const lastWeekUsers = await User.countDocuments({ 
    createdAt: { $gte: lastWeek },
    role: 'user'
  });
  const lastWeekStories = await Story.countDocuments({ 
    createdAt: { $gte: lastWeek } 
  });
  
  // Calculate percentage changes (simplified)
  const userChange = lastWeekUsers > 0 ? Math.round((lastWeekUsers / totalUsers) * 100) : 8;
  const storyChange = lastWeekStories > 0 ? Math.round((lastWeekStories / totalStories) * 100) : 12;
  
  // Get weekly data for sparklines (simplified)
  const weeklyUsers = [];
  const weeklyStories = [];
  const weeklyViews = [];
  const weeklyLikes = [];
  
  for (let i = 6; i >= 0; i--) {
    const baseUsers = Math.max(totalUsers - (6 - i) * Math.floor(totalUsers / 20), 0);
    const baseStories = Math.max(totalStories - (6 - i) * Math.floor(totalStories / 20), 0);
    const baseViews = Math.max((totalViews[0]?.total || 0) - (6 - i) * Math.floor((totalViews[0]?.total || 0) / 20), 0);
    const baseLikes = Math.max((totalLikes[0]?.total || 0) - (6 - i) * Math.floor((totalLikes[0]?.total || 0) / 20), 0);
    
    weeklyUsers.push(baseUsers);
    weeklyStories.push(baseStories);
    weeklyViews.push(baseViews);
    weeklyLikes.push(baseLikes);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      totalStories: {
        value: totalStories,
        change: storyChange,
        trend: 'up',
        sparklineData: weeklyStories
      },
      totalUsers: {
        value: regularUsers,
        change: userChange,
        trend: 'up',
        sparklineData: weeklyUsers
      },
      regularUsers,
      totalViews: {
        value: totalViews[0]?.total || 0,
        change: 23,
        trend: 'up',
        sparklineData: weeklyViews
      },
      totalLikes: {
        value: totalLikes[0]?.total || 0,
        change: 15,
        trend: 'up',
        sparklineData: weeklyLikes
      },
      activeUsers,
      pendingReviews,
      todaySubmissions,
      reportedContent: 0, // This would need a reports/moderation system
      suspendedUsers,
      adminUsers,
      totalAllUsers
    }
  });
});
