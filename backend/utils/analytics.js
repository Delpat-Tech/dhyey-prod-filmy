const mongoose = require('mongoose');
const User = require('../models/User');
const Story = require('../models/Story');
const Comment = require('../models/Comment');

class AnalyticsService {
  constructor() {
    this.eventTypes = {
      STORY_VIEW: 'story_view',
      STORY_LIKE: 'story_like',
      STORY_SAVE: 'story_save',
      STORY_SHARE: 'story_share',
      COMMENT_CREATE: 'comment_create',
      USER_FOLLOW: 'user_follow',
      USER_SIGNUP: 'user_signup',
      USER_LOGIN: 'user_login'
    };
  }

  // Track user engagement event
  async trackEvent(eventType, userId, data = {}) {
    try {
      const event = {
        type: eventType,
        userId: userId ? new mongoose.Types.ObjectId(userId) : null,
        data,
        timestamp: new Date(),
        ip: data.ip,
        userAgent: data.userAgent
      };

      // Store in analytics collection (you can implement this with a separate Analytics model)
      // For now, we'll update relevant models directly
      
      switch (eventType) {
        case this.eventTypes.STORY_VIEW:
          await this.trackStoryView(data.storyId, userId, data);
          break;
        case this.eventTypes.STORY_LIKE:
          await this.trackStoryLike(data.storyId, userId);
          break;
        case this.eventTypes.STORY_SAVE:
          await this.trackStorySave(data.storyId, userId);
          break;
        case this.eventTypes.STORY_SHARE:
          await this.trackStoryShare(data.storyId, data.platform);
          break;
        case this.eventTypes.USER_FOLLOW:
          await this.trackUserFollow(data.followedUserId, userId);
          break;
        case this.eventTypes.USER_SIGNUP:
          await this.trackUserSignup(userId, data);
          break;
        case this.eventTypes.USER_LOGIN:
          await this.trackUserLogin(userId);
          break;
      }

      return event;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw error to avoid breaking main functionality
    }
  }

  // Track story view
  async trackStoryView(storyId, userId, data = {}) {
    const story = await Story.findById(storyId);
    if (!story) return;

    await story.incrementView(userId, data.readingTime, data.completed);
  }

  // Track story like
  async trackStoryLike(storyId, userId) {
    const story = await Story.findById(storyId);
    if (!story) return;

    await story.toggleLike(userId);
  }

  // Track story save
  async trackStorySave(storyId, userId) {
    // Story save tracking is now handled in the controller
    // Just increment the shares count for analytics
    await Story.findByIdAndUpdate(storyId, {
      $inc: { 'stats.shares': 0 } // No-op, save is handled elsewhere
    });
  }

  // Track story share
  async trackStoryShare(storyId, platform) {
    await Story.findByIdAndUpdate(storyId, {
      $inc: { 'stats.shares': 1 }
    });
  }

  // Track user follow
  async trackUserFollow(followedUserId, followerId) {
    const [followedUser, follower] = await Promise.all([
      User.findById(followedUserId),
      User.findById(followerId)
    ]);

    if (!followedUser || !follower) return;

    const isAlreadyFollowing = followedUser.followers.includes(followerId);
    
    if (isAlreadyFollowing) {
      // Unfollow
      followedUser.followers.pull(followerId);
      follower.following.pull(followedUserId);
    } else {
      // Follow
      followedUser.followers.push(followerId);
      follower.following.push(followedUserId);
    }

    await Promise.all([
      followedUser.save({ validateBeforeSave: false }),
      follower.save({ validateBeforeSave: false })
    ]);
  }

  // Track user signup
  async trackUserSignup(userId, data) {
    // This could store signup source, referrer, etc.
    console.log(`User ${userId} signed up from ${data.source || 'direct'}`);
  }

  // Track user login
  async trackUserLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      $inc: { loginCount: 1 },
      lastActive: new Date()
    });
  }

  // Get user analytics
  async getUserAnalytics(userId, timeRange = '30d') {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const dateRange = this.getDateRange(timeRange);
    
    const [
      storiesStats,
      engagementStats,
      followersGrowth,
      topStories
    ] = await Promise.all([
      this.getUserStoriesStats(userId, dateRange),
      this.getUserEngagementStats(userId, dateRange),
      this.getUserFollowersGrowth(userId, dateRange),
      this.getUserTopStories(userId, 5)
    ]);

    return {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        stats: user.stats
      },
      timeRange,
      stories: storiesStats,
      engagement: engagementStats,
      followers: followersGrowth,
      topStories
    };
  }

  // Get story analytics
  async getStoryAnalytics(storyId, timeRange = '30d') {
    const story = await Story.findById(storyId).populate('author', 'name username');
    if (!story) throw new Error('Story not found');

    const dateRange = this.getDateRange(timeRange);

    const [
      viewsOverTime,
      engagementStats,
      readerDemographics,
      comments
    ] = await Promise.all([
      this.getStoryViewsOverTime(storyId, dateRange),
      this.getStoryEngagementStats(storyId),
      this.getStoryReaderDemographics(storyId),
      Comment.find({ story: storyId, parentComment: null })
        .populate('author', 'name username avatar')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    return {
      story: {
        id: story._id,
        title: story.title,
        author: story.author,
        publishedAt: story.publishedAt,
        stats: story.stats
      },
      timeRange,
      views: viewsOverTime,
      engagement: engagementStats,
      demographics: readerDemographics,
      recentComments: comments
    };
  }

  // Get platform analytics (admin only)
  async getPlatformAnalytics(timeRange = '30d') {
    const dateRange = this.getDateRange(timeRange);

    const [
      userStats,
      storyStats,
      engagementStats,
      topContent
    ] = await Promise.all([
      this.getPlatformUserStats(dateRange),
      this.getPlatformStoryStats(dateRange),
      this.getPlatformEngagementStats(dateRange),
      this.getPlatformTopContent()
    ]);

    return {
      timeRange,
      users: userStats,
      stories: storyStats,
      engagement: engagementStats,
      topContent
    };
  }

  // Helper methods
  getDateRange(timeRange) {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate: now };
  }

  async getUserStoriesStats(userId, dateRange) {
    return Story.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          publishedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalStories: { $sum: 1 },
          totalViews: { $sum: '$stats.views' },
          totalLikes: { $sum: '$stats.likes' },
          totalComments: { $sum: '$stats.comments' },
          totalSaves: { $sum: '$stats.saves' },
          avgReadTime: { $avg: '$readTime' }
        }
      }
    ]);
  }

  async getUserEngagementStats(userId, dateRange) {
    const stories = await Story.find({
      author: userId,
      publishedAt: { $gte: dateRange.startDate, $lte: dateRange.endDate }
    });

    const totalViews = stories.reduce((sum, story) => sum + story.stats.views, 0);
    const totalEngagements = stories.reduce((sum, story) => 
      sum + story.stats.likes + story.stats.comments + story.stats.saves, 0
    );

    return {
      engagementRate: totalViews > 0 ? (totalEngagements / totalViews * 100).toFixed(2) : 0,
      avgViewsPerStory: stories.length > 0 ? Math.round(totalViews / stories.length) : 0,
      avgEngagementsPerStory: stories.length > 0 ? Math.round(totalEngagements / stories.length) : 0
    };
  }

  async getUserFollowersGrowth(userId, dateRange) {
    // This would require storing follower history
    // For now, return current follower count
    const user = await User.findById(userId);
    return {
      current: user.stats.followersCount,
      growth: 0 // Would calculate from historical data
    };
  }

  async getUserTopStories(userId, limit = 5) {
    return Story.find({
      author: userId,
      status: 'published'
    })
    .sort({ 'stats.views': -1, 'stats.likes': -1 })
    .limit(limit)
    .select('title stats publishedAt slug');
  }

  async getStoryViewsOverTime(storyId, dateRange) {
    // This would require storing view history with timestamps
    // For now, return current stats
    const story = await Story.findById(storyId);
    return {
      totalViews: story.stats.views,
      dailyViews: [] // Would calculate from historical data
    };
  }

  async getStoryEngagementStats(storyId) {
    const story = await Story.findById(storyId);
    const totalEngagements = story.stats.likes + story.stats.comments + story.stats.saves;
    
    return {
      views: story.stats.views,
      likes: story.stats.likes,
      comments: story.stats.comments,
      saves: story.stats.saves,
      shares: story.stats.shares,
      engagementRate: story.stats.views > 0 ? 
        (totalEngagements / story.stats.views * 100).toFixed(2) : 0
    };
  }

  async getStoryReaderDemographics(storyId) {
    // This would analyze the viewHistory array
    const story = await Story.findById(storyId);
    return {
      totalReaders: story.viewHistory.length,
      completionRate: story.viewHistory.length > 0 ? 
        (story.viewHistory.filter(v => v.completed).length / story.viewHistory.length * 100).toFixed(2) : 0,
      avgReadingTime: story.viewHistory.length > 0 ?
        Math.round(story.viewHistory.reduce((sum, v) => sum + (v.readingTime || 0), 0) / story.viewHistory.length) : 0
    };
  }

  async getPlatformUserStats(dateRange) {
    const [totalUsers, newUsers, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: dateRange.startDate } }),
      User.countDocuments({ lastActive: { $gte: dateRange.startDate } })
    ]);

    return { totalUsers, newUsers, activeUsers };
  }

  async getPlatformStoryStats(dateRange) {
    const [totalStories, newStories, publishedStories] = await Promise.all([
      Story.countDocuments(),
      Story.countDocuments({ createdAt: { $gte: dateRange.startDate } }),
      Story.countDocuments({ 
        status: 'published',
        publishedAt: { $gte: dateRange.startDate }
      })
    ]);

    return { totalStories, newStories, publishedStories };
  }

  async getPlatformEngagementStats(dateRange) {
    const [totalViews, totalLikes, totalComments] = await Promise.all([
      Story.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.views' } } }
      ]),
      Story.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.likes' } } }
      ]),
      Comment.countDocuments({ createdAt: { $gte: dateRange.startDate } })
    ]);

    return {
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      totalComments
    };
  }

  async getPlatformTopContent() {
    const [topStories, topAuthors, topGenres] = await Promise.all([
      Story.find({ status: 'published' })
        .populate('author', 'name username')
        .sort({ 'stats.views': -1 })
        .limit(10)
        .select('title author stats publishedAt'),
      
      User.find()
        .sort({ 'stats.followersCount': -1 })
        .limit(10)
        .select('name username stats'),
      
      Story.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$genre', count: { $sum: 1 }, totalViews: { $sum: '$stats.views' } } },
        { $sort: { totalViews: -1 } },
        { $limit: 10 }
      ])
    ]);

    return { topStories, topAuthors, topGenres };
  }
}

module.exports = new AnalyticsService();
