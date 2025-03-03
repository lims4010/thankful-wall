const NodeCache = require('node-cache');

// Create a cache instance with 24-hour TTL (time-to-live)
const postLimitsCache = new NodeCache({ stdTTL: 24 * 60 * 60 });

/**
 * PostLimiter - Manages user post limits using in-memory cache
 */
class PostLimiter {
  /**
   * Find a user's post count by IP
   * @param {String} ip - The IP address
   * @returns {Object} The limit entry with count
   */
  static findByIp(ip) {
    const count = postLimitsCache.get(ip) || 0;
    return { ip, count };
  }

  /**
   * Create a new limit entry
   * @param {String} ip - The IP address
   * @param {Number} count - The initial count
   * @returns {Object} The created limit entry
   */
  static create(ip, count = 1) {
    postLimitsCache.set(ip, count);
    return { ip, count };
  }

  /**
   * Increment the count for an IP
   * @param {String} ip - The IP address
   * @returns {Object} The updated limit entry
   */
  static incrementCount(ip) {
    const currentCount = postLimitsCache.get(ip) || 0;
    const newCount = currentCount + 1;
    postLimitsCache.set(ip, newCount);
    return { ip, count: newCount };
  }

  /**
   * Decrement the count for an IP
   * @param {String} ip - The IP address
   * @returns {Object} The updated limit entry
   */
  static decrementCount(ip) {
    const currentCount = postLimitsCache.get(ip) || 0;
    
    if (currentCount <= 0) {
      return { ip, count: 0 };
    }
    
    const newCount = currentCount - 1;
    postLimitsCache.set(ip, newCount);
    return { ip, count: newCount };
  }

  /**
   * Check if a user has reached their post limit
   * @param {String} ip - The IP address
   * @param {Number} maxPosts - Maximum allowed posts (default: 3)
   * @returns {Boolean} True if limit reached, false otherwise
   */
  static hasReachedLimit(ip, maxPosts = 3) {
    const currentCount = postLimitsCache.get(ip) || 0;
    return currentCount >= maxPosts;
  }

  /**
   * Reset all limits (mainly for testing purposes)
   */
  static resetAllLimits() {
    postLimitsCache.flushAll();
  }
}

module.exports = PostLimiter; 