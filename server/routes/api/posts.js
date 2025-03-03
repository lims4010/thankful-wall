const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const checkJwt = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

const Post = require('../../models/Post');
const PostLimiter = require('../../models/PostLimiter');

// @route   GET api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const partitionKey = req.query.partitionKey || "PUBLIC";
    let lastEvaluatedKey = null;
    
    // Check if we have a lastEvaluatedKey in the query
    if (req.query.lastKey) {
      try {
        lastEvaluatedKey = JSON.parse(req.query.lastKey);
      } catch (e) {
        console.error('Invalid lastKey format:', e);
      }
    }
    
    const result = await Post.findAll(limit, lastEvaluatedKey, partitionKey);
    res.json(result);
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Public
router.post(
  '/',
  [check('text', 'Text is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const ip = req.ip;
      
      // Check if user has reached post limit
      if (PostLimiter.hasReachedLimit(ip)) {
        return res.status(401).json({ errors: 'Max posts reached' });
      }

      const { text, name, partitionKey } = req.body;

      const newPost = {
        text,
        name: name || 'Anonymous',
        likes: [],
        created_date: new Date().toISOString()
      };

      const post = await Post.create(newPost, partitionKey || "PUBLIC");

      // Increment post count for this IP
      PostLimiter.incrementCount(ip);

      // No need for setTimeout to decrement count - the cache will auto-expire after 24 hours

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const post_type = req.query.post_type || "PUBLIC";
    const result = await Post.deleteById(req.params.id, post_type);
    
    if (!result) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(`Error deleting post ${req.params.id}: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    res.status(500).json({ 
      msg: 'Server Error', 
      error: err.message 
    });
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Public
router.put('/like/:id', async (req, res) => {
  try {
    const ip = req.ip;
    const post_type = req.query.post_type || "PUBLIC";
    const updatedLikes = await Post.updateLikes(req.params.id, ip, post_type);
    res.json(updatedLikes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
