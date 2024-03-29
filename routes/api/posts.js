const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Limit = require('../../models/Limit');

// @route  POST api/posts
// @desc   Create a post
router.post(
  '/',
  [
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, name } = req.body;

    try {
      const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

      let limit = await Limit.findOne({ ip });

      if (limit) {
        if (limit.count >= 3) {
          return res.status(401).json({ errors: 'Limit Reached' });
        }
        limit.count++;
        await limit.save();
      } else {
        const newLimit = new Limit({
          ip: ip,
          count: 1
        });
        await newLimit.save();
      }

      const newPost = new Post({
        text: text,
        name: name ? name : 'Anonymous'
      });
      const post = await newPost.save();
      res.json(post);

      setTimeout(async () => {
        let limit = await Limit.findOne({ ip });
        limit.count--;
        await limit.save();
      }, 86400000);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/posts
// @desc   Get all post

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    posts.forEach(post => {
      post.likes = post.likes.length;
    });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route  Delete api/posts/:id
// @desc   Delete a post

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (error) {
    console.error(error.message);
    // Check if post id is invalid format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post

router.put('/like/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    //Check if post has already been liked
    if (post.likes.includes(ip)) {
       // Get remove index
      const removeIndex = post.likes.indexOf(ip);
      post.likes.splice(removeIndex, 1);
    } else {
      post.likes.unshift(ip);
    }
    await post.save();
    res.json(post.likes.length);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// 3/13/22 - Removed feature. Include in Like logic.
// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post

// router.put('/unlike/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
//     //Check if post has not been liked
//     if (!post.likes.includes(ip)) {
//       return res.status(400).json({ msg: 'Post has not yet been liked' });
//     }

//     // Get remove index
//     const removeIndex = post.likes.indexOf(ip);
//     post.likes.splice(removeIndex, 1);
//     await post.save();
//     res.json(post.likes.length);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// });

module.exports = router;
