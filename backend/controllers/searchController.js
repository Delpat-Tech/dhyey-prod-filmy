const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const searchService = require('../utils/search');

// Search stories
exports.searchStories = catchAsync(async (req, res, next) => {
  const { q, page, limit, sortBy, genre, author } = req.query;

  console.log('Search request:', { q, page, limit, sortBy, genre, author });

  if (!q || q.trim().length < 2) {
    return next(new AppError('Search query must be at least 2 characters long', 400));
  }

  // Build query with filters
  let searchQuery = q;
  if (genre && genre !== 'undefined') searchQuery += ` genre:${genre}`;
  if (author) searchQuery += ` author:${author}`;

  console.log('Final search query:', searchQuery);

  const results = await searchService.searchStories(searchQuery, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sortBy: sortBy || 'relevance'
  });

  console.log('Found stories:', results.stories.length);

  res.status(200).json({
    status: 'success',
    query: q,
    ...results
  });
});

// Search users
exports.searchUsers = catchAsync(async (req, res, next) => {
  const { q, page, limit, sortBy } = req.query;

  if (!q || q.trim().length < 2) {
    return next(new AppError('Search query must be at least 2 characters long', 400));
  }

  const results = await searchService.searchUsers(q, {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    sortBy: sortBy || 'relevance'
  });

  res.status(200).json({
    status: 'success',
    query: q,
    ...results
  });
});

// Get search suggestions
exports.getSearchSuggestions = catchAsync(async (req, res, next) => {
  const { q, limit } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json({
      status: 'success',
      suggestions: []
    });
  }

  const suggestions = await searchService.getSearchSuggestions(q, parseInt(limit) || 5);

  res.status(200).json({
    status: 'success',
    query: q,
    suggestions
  });
});

// Get available filters
exports.getSearchFilters = catchAsync(async (req, res, next) => {
  const filters = await searchService.getAvailableFilters();

  res.status(200).json({
    status: 'success',
    data: { filters }
  });
});

// Combined search (stories and users)
exports.globalSearch = catchAsync(async (req, res, next) => {
  const { q, page, limit } = req.query;

  if (!q || q.trim().length < 2) {
    return next(new AppError('Search query must be at least 2 characters long', 400));
  }

  const searchLimit = Math.min(parseInt(limit) || 10, 20);
  
  const [storiesResults, usersResults] = await Promise.all([
    searchService.searchStories(q, {
      page: parseInt(page) || 1,
      limit: searchLimit,
      sortBy: 'relevance'
    }),
    searchService.searchUsers(q, {
      page: parseInt(page) || 1,
      limit: searchLimit,
      sortBy: 'relevance'
    })
  ]);

  res.status(200).json({
    status: 'success',
    query: q,
    results: {
      stories: {
        items: storiesResults.stories,
        pagination: storiesResults.pagination
      },
      users: {
        items: usersResults.users,
        pagination: usersResults.pagination
      }
    }
  });
});

module.exports = exports;
