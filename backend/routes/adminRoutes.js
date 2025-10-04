const express = require('express');
const storyController = require('../controllers/storyController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes
router.use(authController.protect);
router.use(authController.restrictTo('admin', 'moderator'));

// Admin Story Management
router.get('/stories', storyController.getAllStoriesForAdmin); // Get ALL stories including pending
router.get('/stories/:id', storyController.getStoryForAdmin); // Get single story for admin review
router.patch('/stories/:id/approve', storyController.approveStory);
router.patch('/stories/:id/reject', storyController.rejectStory);
router.patch('/stories/bulk-approve', storyController.bulkApproveStories);
router.patch('/stories/bulk-reject', storyController.bulkRejectStories);

// Admin User Management
router.get('/users', userController.getAllUsersForAdmin);
router.patch('/users/:id/suspend', userController.suspendUser);
router.patch('/users/:id/unsuspend', userController.unsuspendUser);
router.delete('/users/:id', userController.deleteUser);

// Admin Analytics
router.get('/analytics', (req, res) => {
  // Mock analytics data for now
  res.status(200).json({
    status: 'success',
    data: {
      overview: {
        totalUsers: { value: 8934, change: 8.2, trend: 'up' },
        totalStories: { value: 1247, change: 12.5, trend: 'up' },
        totalViews: { value: 125678, change: 23.1, trend: 'up' },
        engagementRate: { value: 68.5, change: -2.3, trend: 'down' }
      }
    }
  });
});

router.get('/dashboard-stats', (req, res) => {
  // Mock dashboard stats for now
  res.status(200).json({
    status: 'success',
    data: {
      totalStories: {
        value: 1247,
        change: 12,
        trend: 'up',
        sparklineData: [1100, 1150, 1180, 1200, 1220, 1240, 1247]
      },
      totalUsers: {
        value: 8934,
        change: 8,
        trend: 'up',
        sparklineData: [8200, 8350, 8500, 8650, 8750, 8850, 8934]
      },
      totalViews: {
        value: 125678,
        change: 23,
        trend: 'up',
        sparklineData: [98000, 105000, 112000, 118000, 122000, 124000, 125678]
      },
      totalLikes: {
        value: 23456,
        change: 15,
        trend: 'up',
        sparklineData: [19500, 20200, 21000, 21800, 22500, 23100, 23456]
      }
    }
  });
});

module.exports = router;
