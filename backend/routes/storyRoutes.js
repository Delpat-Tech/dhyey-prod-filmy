const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes (with optional auth to track user interactions)
router.get('/', authController.optionalAuth, storyController.getPublicStories);
router.get('/search', authController.optionalAuth, storyController.searchStories);
router.get('/slug/:slug', authController.optionalAuth, storyController.getStoryBySlug);
router.get('/:id', authController.optionalAuth, storyController.getStoryById);
router.get('/user/:userId', authController.optionalAuth, storyController.getUserStories);

// Protected routes (require authentication)
router.use(authController.protect);

// Story CRUD operations
router.post('/', 
  storyController.uploadStoryImage,
  storyController.processStoryImage,
  storyController.createStory
);

router.patch('/:id',
  storyController.uploadStoryImage,
  storyController.processStoryImage,
  storyController.updateStory
);

router.delete('/:id', storyController.deleteStory);

// Story interactions
router.post('/:id/like', storyController.toggleLikeStory);
router.post('/:id/save', storyController.toggleSaveStory);
router.post('/:id/share', storyController.shareStory);

// Comment routes
router.get('/:id/comments', storyController.getStoryComments);
router.post('/:id/comments', storyController.addComment);
router.post('/:id/comments/:commentId/like', storyController.toggleLikeComment);

module.exports = router;
