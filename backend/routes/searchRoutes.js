const express = require('express');
const storyController = require('../controllers/storyController');

const router = express.Router();

// Public search routes
router.get('/stories', storyController.searchStories);

module.exports = router;
