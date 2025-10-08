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

// Test token endpoint
router.get('/test-auth', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authentication successful',
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Admin User Management
router.get('/admins', userController.getAllAdmins);
router.post('/create-admin', authController.createAdmin);
router.patch('/users/:id/suspend', userController.suspendUser);
router.patch('/users/:id/unsuspend', userController.unsuspendUser);

// Admin Profile Management
router.get('/profile', userController.getMe);
router.patch('/profile', userController.uploadUserPhoto, userController.processUserPhoto, userController.updateMe);

// Admin Settings Management
router.get('/settings', userController.getMe);
router.patch('/settings', userController.updateMe);

// Admin Analytics
router.get('/analytics', userController.getDashboardAnalytics);

router.get('/dashboard-stats', userController.getDashboardStats);

module.exports = router;
