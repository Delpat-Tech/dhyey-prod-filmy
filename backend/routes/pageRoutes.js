const express = require('express');
const pageController = require('../controllers/pageController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/:slug', pageController.getPageBySlug);

// Admin routes (protected)
router.use(authController.protect);

router
  .route('/')
  .get(pageController.getAllPages)
  .post(pageController.createPage);

router
  .route('/:id')
  .get(pageController.getPage)
  .patch(pageController.updatePage)
  .delete(pageController.deletePage);

module.exports = router;
