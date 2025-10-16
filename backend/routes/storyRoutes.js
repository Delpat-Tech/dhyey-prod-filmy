const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes (with optional auth to track user interactions)
router.get('/', authController.optionalAuth, storyController.getPublicStories);
router.get('/search', authController.optionalAuth, storyController.searchStories);
router.get('/by-user/:userId', authController.optionalAuth, storyController.getUserStories);
router.get('/:slug', authController.optionalAuth, storyController.getStoryBySlug);

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

// Story interactions (using ObjectId)
router.post('/id/:id/like', storyController.toggleLikeStory);
router.post('/id/:id/save', storyController.toggleSaveStory);
router.post('/id/:id/share', storyController.shareStory);

// Comment routes (using ObjectId)
router.get('/id/:id/comments', storyController.getStoryComments);
router.post('/id/:id/comments', storyController.addComment);
router.post('/id/:id/comments/:commentId/like', storyController.toggleLikeComment);

module.exports = router;
