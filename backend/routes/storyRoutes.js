const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', storyController.getPublicStories);
router.get('/search', storyController.searchStories);
router.get('/:id', authController.optionalAuth, storyController.getStoryById);

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

// User's stories
router.get('/user/:userId', storyController.getUserStories);

module.exports = router;
