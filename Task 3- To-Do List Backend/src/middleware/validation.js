/**
 * Request Input Validation Middleware
 * Checks structural formats and details of payloads for register, login, and tasks.
 */

const { isValidEmail, isValidDate } = require('../utils/validators');

// Validate User registration body
const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'The email address format is invalid' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password is required and must be at least 6 characters long' });
  }

  next();
};

// Validate User login body
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ error: 'Email address is required to login' });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ error: 'Password is required to login' });
  }

  next();
};

// Validate Task create/update body
const validateTask = (req, res, next) => {
  const { title, completed, priority, dueDate, category } = req.body;
  const isUpdate = req.method === 'PUT';

  // Title validation
  if (!isUpdate || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title must be a non-empty string' });
    }
  }

  // Completion status validation
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed status must be a boolean (true/false)' });
  }

  // Priority validation
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({ error: 'Priority must be either low, medium, or high' });
    }
  }

  // Due Date validation
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    if (!isValidDate(dueDate)) {
      return res.status(400).json({ error: 'Due date must be a valid date format' });
    }
  }

  // Category validation
  if (category !== undefined && typeof category !== 'string') {
    return res.status(400).json({ error: 'Category must be a string' });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask
};
