/**
 * Authentication Controller
 * Handles business logic for user signup and signin.
 * Issues JSON Web Tokens (JWT) for authenticated requests.
 */

const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'supersecretjwtkeyforauth',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: `An account with email '${email}' is already registered.` });
    }

    // 2. Create new user (Mongoose pre-save hook handles bcrypt hashing)
    const user = new User({ email, password });
    await user.save();

    // 3. Generate JWT token
    const token = generateToken(user);

    // 4. Return response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    next(error); // Delegate error handling to central error middleware
  }
};

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed. Invalid email or password.' });
    }

    // 2. Compare candidate password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Authentication failed. Invalid email or password.' });
    }

    // 3. Generate JWT token
    const token = generateToken(user);

    // 4. Return response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    next(error); // Delegate to central error middleware
  }
};

module.exports = {
  register,
  login
};
