const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    // Skip caching for authenticated requests or POST/PUT/DELETE
    if (req.method !== 'GET' || req.headers.authorization) {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      return res.json(cached.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      // Clean old cache entries
      if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = cacheMiddleware;