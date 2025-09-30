const Page = require('../models/pageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Get page by slug (public)
exports.getPageBySlug = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ 
    slug: req.params.slug, 
    isPublished: true 
  }).select('title slug body lastUpdated');

  if (!page) {
    return next(new AppError('No page found with that slug', 404));
  }

  res.status(200).json({
    data: {
      title: page.title,
      slug: page.slug,
      body: page.body,
      lastUpdated: page.lastUpdated
    }
  });
});

// Admin functions using factory
exports.getAllPages = factory.getAll(Page);
exports.getPage = factory.getOne(Page);
exports.createPage = factory.createOne(Page);
exports.updatePage = factory.updateOne(Page);
exports.deletePage = factory.deleteOne(Page);
