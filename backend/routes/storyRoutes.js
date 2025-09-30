const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

// Admin routes (must come before parameterized routes)
router.use('/admin', authController.protect);
router
  .route('/admin')
  .get(storyController.getAllStories);

router
  .route('/admin/:id')
  .get(storyController.getStory)
  .patch(storyController.updateStory)
  .delete(storyController.deleteStory);

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
