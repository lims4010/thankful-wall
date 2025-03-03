const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const config = require('../config/default.js');

// Create middleware for checking the JWT
const checkJwt = auth({
  audience: config.auth0.audience,
  issuerBaseURL: `https://${config.auth0.domain}/`,
  tokenSigningAlg: 'RS256'
});

// Create middleware for checking admin scope
const checkAdminScope = requiredScopes('admin');

// Middleware to check for admin permissions
const requireAdmin = (req, res, next) => {
  // First verify the JWT
  checkJwt(req, res, (err) => {
    if (err) {
      return next(err);
    }
    
    // Then check for admin scope
    checkAdminScope(req, res, next);
  });
};

// For backward compatibility, export checkJwt as the default export
module.exports = checkJwt;
// Also export the named functions
module.exports.checkJwt = checkJwt;
module.exports.requireAdmin = requireAdmin;
