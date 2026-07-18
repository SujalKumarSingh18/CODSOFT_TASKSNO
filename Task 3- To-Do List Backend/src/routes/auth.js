/**
 * Authentication Routes
 * Mounts endpoints for user registration and login.
 */

const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, login);

module.exports = router;
