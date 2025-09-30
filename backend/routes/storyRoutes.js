const express = require('express');
const storyController = require('../controllers/storyController');
const moderationController = require('../controllers/moderationController');
const authController = require('../controllers/authController');

const router = express.Router();

// Admin routes (must come before parameterized routes)
router.use('/admin', authController.protect);

// Moderation statistics (must come before parameterized routes)
router.get('/admin/moderation/stats', moderationController.getModerationStats);

router
  .route('/admin')
  .get(storyController.getAllStories);

router
  .route('/admin/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

// Moderation routes
router.patch('/admin/:id/approve', moderationController.approveStory);
router.patch('/admin/:id/reject', moderationController.rejectStory);
router.patch('/admin/:id/unpublish', moderationController.unpublishStory);
router.get('/admin/:id/moderation-history', moderationController.getModerationHistory);

// Public routes
router.get('/', storyController.getPublicStories);
router.get('/:storyId', storyController.getStoryById);

// Protected routes (require authentication)
router.use(authController.protect);

router.post('/', 
  storyController.uploadStoryImage,
  storyController.resizeStoryImage,
  storyController.createStory
);

module.exports = router;
