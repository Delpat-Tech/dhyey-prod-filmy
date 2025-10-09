const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Public routes (no authentication required)
router.get('/profile/:identifier', userController.getUserProfile); // Can be ID or username

// Protected routes (require authentication)
router.use(authController.protect);

// Current user routes
router.get('/me', userController.getMe);
router.patch('/me',
  userController.uploadUserPhoto,
  userController.processUserPhoto,
  userController.updateMe
);

// User interactions
router.post('/:userId/follow', userController.toggleFollowUser);
router.get('/:userId/followers', userController.getUserFollowers);
router.get('/:userId/following', userController.getUserFollowing);
router.get('/:userId/saved', userController.getUserSavedStories);
router.get('/me/liked', userController.getUserLikedStories);

// Admin routes
router.get('/admin/all', authController.restrictTo('admin'), userController.getAllUsersForAdmin);

module.exports = router;
