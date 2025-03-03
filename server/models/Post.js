const db = require('../config/db');
const config = require('../config/default');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = config.dynamoDBTables.posts;

class Post {
  /**
   * Create a new post
   * @param {Object} postData - The post data
   * @param {String} partitionKey - The partition key for the post
   * @returns {Object} The created post
   */
  static async create(postData, partitionKey = "PUBLIC") {
    const post = {
      id: uuidv4(),
      post_type: partitionKey,
      ...postData,
      created_date: postData.created_date || new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: post
    };

    await db.put(params);
    return post;
  }

  /**
   * Find all posts with pagination
   * @param {Number} limit - Number of posts to return
   * @param {Object} lastEvaluatedKey - Last evaluated key for pagination
   * @param {String} partitionKey - The partition key to query
   * @returns {Object} Object containing posts array and lastEvaluatedKey
   */
  static async findAll(limit = 10, lastEvaluatedKey = null, partitionKey = "PUBLIC") {
    // Use query with the provided partition key and sort by date
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "post_type = :pk",
      ExpressionAttributeValues: {
        ":pk": partitionKey
      },
      Limit: limit,
      ScanIndexForward: false // This will sort in descending order (newest first)
    };

    // If we have a lastEvaluatedKey, use it for pagination
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    // Query using the partition key
    const result = await db.query(params);
    
    // Transform likes for client display
    const formattedPosts = result.Items ? result.Items.map(post => ({
      ...post,
      likes: post.likes || []
    })) : [];

    console.log(`Fetched ${formattedPosts.length} posts using query with partition key: ${partitionKey}`);
    
    return {
      posts: formattedPosts,
      lastEvaluatedKey: result.LastEvaluatedKey
    };
  }

  /**
   * Find a post by ID
   * @param {String} id - The post ID
   * @param {String} type - The partition key (default: PUBLIC)
   * @returns {Object} The post
   */
  static async findById(id, type = "PUBLIC") {
    // We need to query by post_type and filter by id since id is not part of the key schema
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "post_type = :pk",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":pk": type,
        ":id": id
      }
    };
    
    try {
      const result = await db.query(params);
      return result.Items && result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
      console.error(`Error finding post with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a post by ID
   * @param {String} id - The post ID
   * @param {String} type - The partition key (default: PUBLIC)
   * @returns {Boolean} Success status
   */
  static async deleteById(id, type = "PUBLIC") {
    // First check if post exists
    try {
      const post = await this.findById(id, type);
      
      if (!post) {
        return false;
      }

      // Now we can delete using the correct key schema
      const params = {
        TableName: TABLE_NAME,
        Key: {
          post_type: type,
          created_date: post.created_date
        },
        // Add a condition to ensure we're deleting the right item
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": id
        }
      };

      await db.delete(params);
      return true;
    } catch (error) {
      console.error(`Error deleting post with id ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Update likes for a post
   * @param {String} id - The post ID
   * @param {String} ip - The user's IP address
   * @param {String} type - The partition key (default: PUBLIC)
   * @returns {Array} Updated likes array
   */
  static async updateLikes(id, ip, type = "PUBLIC") {
    const post = await this.findById(id, type);
    if (!post) {
      return null;
    }

    const likes = post.likes || [];
    const index = likes.indexOf(ip);

    // Toggle like status
    if (index === -1) {
      likes.push(ip);
    } else {
      likes.splice(index, 1);
    }

    const params = {
      TableName: TABLE_NAME,
      Key: {
        post_type: type,
        created_date: post.created_date
      },
      UpdateExpression: 'set likes = :likes',
      ExpressionAttributeValues: {
        ':likes': likes
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await db.update(params);
    return likes;
  }
}

module.exports = Post;
