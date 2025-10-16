const Story = require('../models/Story');
const User = require('../models/User');

class SearchService {
  constructor() {
    this.defaultLimit = 20;
    this.maxLimit = 100;
  }

  // Parse search query and extract filters
  parseQuery(query) {
    const filters = {
      text: '',
      genre: null,
      tags: [],
      hashtags: [],
      author: null,
      dateRange: null
    };

    if (!query) return filters;

    // Extract genre filter (genre:fiction)
    const genreMatch = query.match(/genre:(\w+)/i);
    if (genreMatch) {
      filters.genre = genreMatch[1];
      query = query.replace(/genre:\w+/gi, '').trim();
    }

    // Extract author filter (author:username)
    const authorMatch = query.match(/author:(\w+)/i);
    if (authorMatch) {
      filters.author = authorMatch[1];
      query = query.replace(/author:\w+/gi, '').trim();
    }

    // Extract title filter (title:text)
    const titleMatch = query.match(/title:(.+)/i);
    if (titleMatch) {
      filters.title = titleMatch[1].trim();
      query = query.replace(/title:.+/gi, '').trim();
    }

    // Extract tags (#tag)
    const tagMatches = query.match(/#\w+/g);
    if (tagMatches) {
      // Keep hashtags with # symbol to match database format
      filters.hashtags = tagMatches.map(tag => tag.toLowerCase());
      query = query.replace(/#\w+/g, '').trim();
    }

    // Extract date range (date:2024 or date:2024-01)
    const dateMatch = query.match(/date:(\d{4}(?:-\d{2})?)/i);
    if (dateMatch) {
      filters.dateRange = dateMatch[1];
      query = query.replace(/date:\d{4}(?:-\d{2})?/gi, '').trim();
    }

    // Remaining text is the main search query
    filters.text = query.trim();

    return filters;
  }

  // Build MongoDB aggregation pipeline for story search
  buildStorySearchPipeline(filters, options = {}) {
    const {
      page = 1,
      limit = this.defaultLimit,
      sortBy = 'relevance',
      includeUnpublished = false
    } = options;

    const pipeline = [];

    // Match stage - Support both 'published' and 'approved' status
    const matchStage = {
      status: includeUnpublished ? { $in: ['published', 'approved', 'draft'] } : { $in: ['published', 'approved'] }
    };

    // Title-only search
    if (filters.title) {
      matchStage.title = new RegExp(filters.title, 'i');
    }
    // Text search - use regex if text index doesn't exist
    else if (filters.text) {
      // Try to use text search, but fallback to regex if needed
      try {
        matchStage.$or = [
          { title: new RegExp(filters.text, 'i') },
          { excerpt: new RegExp(filters.text, 'i') },
          { content: new RegExp(filters.text, 'i') }
        ];
      } catch (error) {
        // Fallback to basic regex search
        matchStage.$or = [
          { title: new RegExp(filters.text, 'i') },
          { excerpt: new RegExp(filters.text, 'i') }
        ];
      }
    }

    // Genre filter
    if (filters.genre) {
      matchStage.genre = new RegExp(filters.genre, 'i');
    }

    // Hashtags filter
    if (filters.hashtags.length > 0) {
      matchStage.hashtags = { $in: filters.hashtags };
    }

    // Date range filter
    if (filters.dateRange) {
      const year = filters.dateRange.split('-')[0];
      const month = filters.dateRange.split('-')[1];
      
      const startDate = new Date(year, month ? month - 1 : 0, 1);
      const endDate = month 
        ? new Date(year, month, 0) 
        : new Date(parseInt(year) + 1, 0, 0);
      
      matchStage.publishedAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    pipeline.push({ $match: matchStage });

    // Author lookup and filter
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    });

    pipeline.push({
      $unwind: '$author'
    });

    // Author filter
    if (filters.author) {
      pipeline.push({
        $match: {
          $or: [
            { 'author.username': new RegExp(filters.author, 'i') },
            { 'author.name': new RegExp(filters.author, 'i') }
          ]
        }
      });
    }

    // Sorting
    let sortStage = {};
    switch (sortBy) {
      case 'relevance':
        sortStage = { 'stats.views': -1, 'stats.likes': -1, publishedAt: -1 };
        break;
      case 'newest':
        sortStage = { publishedAt: -1 };
        break;
      case 'oldest':
        sortStage = { publishedAt: 1 };
        break;
      case 'popular':
        sortStage = { 'stats.likes': -1, 'stats.views': -1 };
        break;
      case 'trending':
        pipeline.push({
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ['$stats.views', 0.1] },
                { $multiply: ['$stats.likes', 2] },
                { $multiply: ['$stats.comments', 3] }
              ]
            }
          }
        });
        sortStage = { trendingScore: -1, publishedAt: -1 };
        break;
      default:
        sortStage = { publishedAt: -1 };
    }

    pipeline.push({ $sort: sortStage });

    // Pagination
    const skip = (page - 1) * Math.min(limit, this.maxLimit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Math.min(limit, this.maxLimit) });

    // Project fields
    pipeline.push({
      $project: {
        title: 1,
        excerpt: 1,
        genre: 1,
        tags: 1,
        hashtags: 1,
        image: 1,
        publishedAt: 1,
        readTime: 1,
        stats: 1,
        slug: 1,
        'author._id': 1,
        'author.name': 1,
        'author.username': 1,
        'author.avatar': 1
      }
    });

    return pipeline;
  }

  // Search stories
  async searchStories(query, options = {}) {
    const filters = this.parseQuery(query);
    const pipeline = this.buildStorySearchPipeline(filters, options);
    
    const stories = await Story.aggregate(pipeline);
    
    // Get total count for pagination
    const countPipeline = this.buildStorySearchPipeline(filters, { ...options, page: 1, limit: 1000000 });
    countPipeline.push({ $count: 'total' });
    const countResult = await Story.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    return {
      stories,
      pagination: {
        page: options.page || 1,
        limit: Math.min(options.limit || this.defaultLimit, this.maxLimit),
        total,
        pages: Math.ceil(total / Math.min(options.limit || this.defaultLimit, this.maxLimit))
      },
      filters: {
        applied: filters,
        available: await this.getAvailableFilters()
      }
    };
  }

  // Search users
  async searchUsers(query, options = {}) {
    const {
      page = 1,
      limit = this.defaultLimit,
      sortBy = 'relevance'
    } = options;

    if (!query || query.trim().length < 2) {
      return {
        users: [],
        pagination: { page, limit, total: 0, pages: 0 }
      };
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    const matchStage = {
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { bio: searchRegex }
      ]
    };

    // Build aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              {
                $cond: [
                  { $regexMatch: { input: '$username', regex: query, options: 'i' } },
                  10, 0
                ]
              },
              {
                $cond: [
                  { $regexMatch: { input: '$name', regex: query, options: 'i' } },
                  5, 0
                ]
              },
              { $multiply: ['$stats.followersCount', 0.01] }
            ]
          }
        }
      }
    ];

    // Sorting
    let sortStage = {};
    switch (sortBy) {
      case 'relevance':
        sortStage = { relevanceScore: -1, 'stats.followersCount': -1 };
        break;
      case 'followers':
        sortStage = { 'stats.followersCount': -1 };
        break;
      case 'newest':
        sortStage = { createdAt: -1 };
        break;
      default:
        sortStage = { relevanceScore: -1 };
    }

    pipeline.push({ $sort: sortStage });

    // Pagination
    const skip = (page - 1) * Math.min(limit, this.maxLimit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Math.min(limit, this.maxLimit) });

    // Project fields
    pipeline.push({
      $project: {
        name: 1,
        username: 1,
        avatar: 1,
        bio: 1,
        stats: 1,
        createdAt: 1,
        relevanceScore: 1
      }
    });

    const users = await User.aggregate(pipeline);

    // Get total count
    const total = await User.countDocuments(matchStage);

    return {
      users,
      pagination: {
        page,
        limit: Math.min(limit, this.maxLimit),
        total,
        pages: Math.ceil(total / Math.min(limit, this.maxLimit))
      }
    };
  }

  // Get available filters for stories
  async getAvailableFilters() {
    const [genres, topTags, topAuthors] = await Promise.all([
      Story.distinct('genre', { status: { $in: ['published', 'approved'] } }),
      Story.aggregate([
        { $match: { status: { $in: ['published', 'approved'] } } },
        { $unwind: '$hashtags' },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]),
      Story.aggregate([
        { $match: { status: { $in: ['published', 'approved'] } } },
        { $group: { _id: '$author', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: '$author' },
        {
          $project: {
            username: '$author.username',
            name: '$author.name',
            count: 1
          }
        }
      ])
    ]);

    return {
      genres: genres.sort(),
      popularTags: topTags.map(tag => tag._id),
      topAuthors: topAuthors
    };
  }

  // Get search suggestions
  async getSearchSuggestions(query, limit = 5) {
    if (!query || query.length < 2) return [];

    const searchRegex = new RegExp(query, 'i');
    
    const [storyTitles, usernames, tags] = await Promise.all([
      Story.find(
        { title: searchRegex, status: { $in: ['published', 'approved'] } },
        { title: 1 }
      ).limit(limit),
      
      User.find(
        { username: searchRegex },
        { username: 1, name: 1 }
      ).limit(limit),
      
      Story.aggregate([
        { $match: { hashtags: searchRegex, status: { $in: ['published', 'approved'] } } },
        { $unwind: '$hashtags' },
        { $match: { hashtags: searchRegex } },
        { $group: { _id: '$hashtags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
    ]);

    return {
      stories: storyTitles.map(s => ({ type: 'story', text: s.title })),
      users: usernames.map(u => ({ type: 'user', text: `@${u.username}`, name: u.name })),
      tags: tags.map(t => ({ type: 'tag', text: t._id }))
    };
  }
}

module.exports = new SearchService();
