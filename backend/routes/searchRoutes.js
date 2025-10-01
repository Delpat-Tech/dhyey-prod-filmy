const express = require('express');
const searchController = require('../controllers/searchController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public search routes
router.get('/stories', searchController.searchStories);
router.get('/users', searchController.searchUsers);
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/filters', searchController.getSearchFilters);
router.get('/global', searchController.globalSearch);

module.exports = router;
