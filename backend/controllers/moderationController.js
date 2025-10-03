const Story = require('../models/Story');
const User = require('../models/User');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper function to add moderation history entry
const addModerationHistory = (story, action, moderator, feedback, previousStatus, newStatus) => {
  const historyEntry = {
    action,
    moderatorId: moderator._id,
    moderatorName: moderator.name,
    timestamp: new Date(),
    previousStatus,
    newStatus
  };

  if (feedback) {
    historyEntry.feedback = feedback;
  }

  story.moderationHistory.push(historyEntry);
  story.lastModeratedBy = moderator._id;
  story.lastModeratedAt = new Date();
};

// Helper function to send status change email
const sendStatusChangeEmail = async (story, newStatus, feedback = null) => {
  try {
    const author = await User.findById(story.authorId);
    if (!author) return;

    const storyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/stories/${story._id}`;
    const email = new Email(author, storyUrl);

    switch (newStatus) {
      case 'published':
        await email.sendStoryApproved(story.title);
        break;
      case 'rejected':
        await email.sendStoryRejected(story.title, feedback);
        break;
      case 'unpublished':
        await email.sendStoryUnpublished(story.title, feedback);
        break;
    }
  } catch (error) {
    console.error('Failed to send status change email:', error);
    // Don't throw error - email failure shouldn't break the moderation action
  }
};

// PATCH /admin/stories/:id/approve → set status to Published
exports.approveStory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  if (story.status === 'published') {
    return next(new AppError('Story is already published', 400));
  }

  const previousStatus = story.status;
  
  // Add moderation history
  addModerationHistory(
    story, 
    'approved', 
    req.user, 
    req.body.feedback || 'Story approved for publication',
    previousStatus,
    'published'
  );

  // Update story status
  story.status = 'published';
  story.publishedDate = new Date();
  story.rejectionFeedback = undefined; // Clear any previous rejection feedback

  await story.save();

  // Send email notification
  await sendStatusChangeEmail(story, 'published');

  res.status(200).json({
    status: 'success',
    message: 'Story approved and published successfully',
    data: {
      id: story._id,
      title: story.title,
      status: story.status,
      publishedDate: story.publishedDate,
      moderatedBy: req.user.name,
      moderatedAt: story.lastModeratedAt
    }
  });
});

// PATCH /admin/stories/:id/reject → set status to Rejected (requires rejection feedback)
exports.rejectStory = catchAsync(async (req, res, next) => {
  const { feedback } = req.body;

  if (!feedback || feedback.trim().length === 0) {
    return next(new AppError('Rejection feedback is required', 400));
  }

  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  if (story.status === 'rejected') {
    return next(new AppError('Story is already rejected', 400));
  }

  const previousStatus = story.status;
  
  // Add moderation history
  addModerationHistory(
    story, 
    'rejected', 
    req.user, 
    feedback,
    previousStatus,
    'rejected'
  );

  // Update story status
  story.status = 'rejected';
  story.rejectionFeedback = feedback;
  story.publishedDate = undefined; // Clear published date if it was published

  await story.save();

  // Send email notification
  await sendStatusChangeEmail(story, 'rejected', feedback);

  res.status(200).json({
    status: 'success',
    message: 'Story rejected successfully',
    data: {
      id: story._id,
      title: story.title,
      status: story.status,
      rejectionFeedback: story.rejectionFeedback,
      moderatedBy: req.user.name,
      moderatedAt: story.lastModeratedAt
    }
  });
});

// PATCH /admin/stories/:id/unpublish → move story to Unpublished status
exports.unpublishStory = catchAsync(async (req, res, next) => {
  const { feedback } = req.body;

  const story = await Story.findById(req.params.id);
  
  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  if (story.status !== 'published') {
    return next(new AppError('Only published stories can be unpublished', 400));
  }

  const previousStatus = story.status;
  
  // Add moderation history
  addModerationHistory(
    story, 
    'unpublished', 
    req.user, 
    feedback || 'Story unpublished by moderator',
    previousStatus,
    'draft'
  );

  // Update story status
  story.status = 'draft'; // Move to draft status
  story.publishedDate = undefined; // Clear published date

  await story.save();

  // Send email notification
  await sendStatusChangeEmail(story, 'unpublished', feedback);

  res.status(200).json({
    status: 'success',
    message: 'Story unpublished successfully',
    data: {
      id: story._id,
      title: story.title,
      status: story.status,
      moderatedBy: req.user.name,
      moderatedAt: story.lastModeratedAt,
      feedback: feedback
    }
  });
});

// GET /admin/stories/:id/moderation-history → get moderation history for a story
exports.getModerationHistory = catchAsync(async (req, res, next) => {
  const story = await Story.findById(req.params.id)
    .populate({
      path: 'moderationHistory.moderatorId',
      select: 'name email'
    })
    .populate({
      path: 'lastModeratedBy',
      select: 'name email'
    });
  
  if (!story) {
    return next(new AppError('No story found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      storyId: story._id,
      storyTitle: story.title,
      currentStatus: story.status,
      lastModeratedBy: story.lastModeratedBy,
      lastModeratedAt: story.lastModeratedAt,
      rejectionFeedback: story.rejectionFeedback,
      moderationHistory: story.moderationHistory.map(entry => ({
        action: entry.action,
        moderator: {
          id: entry.moderatorId?._id,
          name: entry.moderatorName,
          email: entry.moderatorId?.email
        },
        timestamp: entry.timestamp,
        feedback: entry.feedback,
        previousStatus: entry.previousStatus,
        newStatus: entry.newStatus
      }))
    }
  });
});

// GET /admin/moderation/stats → get moderation statistics
exports.getModerationStats = catchAsync(async (req, res, next) => {
  const stats = await Story.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get stories pending review (older than 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const pendingReview = await Story.countDocuments({
    status: 'in_review',
    createdAt: { $lt: oneDayAgo }
  });

  // Get recent moderation activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentActivity = await Story.countDocuments({
    lastModeratedAt: { $gte: sevenDaysAgo }
  });

  const formattedStats = {
    draft: 0,
    in_review: 0,
    published: 0,
    rejected: 0
  };

  stats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
  });

  res.status(200).json({
    status: 'success',
    data: {
      statusCounts: formattedStats,
      pendingReview,
      recentActivity,
      totalStories: Object.values(formattedStats).reduce((sum, count) => sum + count, 0)
    }
  });
});
