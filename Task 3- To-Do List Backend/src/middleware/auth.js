/**
 * User Authentication Middleware (JWT verification)
 * Validates the Authorization Bearer Token on restricted routes
 * and populates req.user with decoded user properties.
 */

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get Authorization header
  const authHeader = req.header('Authorization');

  // Check if header is present and format is valid (Bearer <token>)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  // Extract the token string
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify JWT token with local secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforauth');
    
    // Attach the user identifier payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`JWT verification failed: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Authentication failed. Token has expired.' });
    }
    
    res.status(401).json({ error: 'Authentication failed. Invalid authorization token.' });
  }
};

module.exports = auth;
