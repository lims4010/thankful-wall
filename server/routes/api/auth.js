const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// @route  GET api/auth/profile
// @desc   Get authenticated user profile from Auth0
// @access Private
router.get('/profile', auth, async (req, res) => {
  try {
    // Auth0 adds the user info to req.auth
    // Just return the Auth0 user info without storing it
    const userProfile = {
      sub: req.auth.sub,
      email: req.auth[`${req.auth.iss}email`] || req.auth.email,
      name: req.auth[`${req.auth.iss}name`] || req.auth.name,
      picture: req.auth[`${req.auth.iss}picture`] || req.auth.picture
    };
    
    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/auth/permissions
// @desc   Get user permissions from the token
// @access Private
router.get('/permissions', auth, async (req, res) => {
  try {
    // Get scope from the token
    const scope = req.auth.scope || '';
    const scopes = scope.split(' ');
    
    // Check if user has admin permission
    const isAdmin = scopes.includes('admin');
    
    res.json({
      scopes,
      isAdmin
    });
  } catch (err) {
    console.error(`Error getting permissions: ${err.message}`);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
