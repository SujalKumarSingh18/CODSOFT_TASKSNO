/**
 * Tasks Routing
 * Maps HTTP verbs to tasks controller handlers.
 * All task actions are secured under the JWT auth middleware.
 */

const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/tasksController');

const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

// Apply JWT authentication middleware to all task routes
router.use(auth);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', validateTask, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks for user (supports filters, search, sort, paginate)
// @access  Private
router.get('/', getTasks);

// @route   GET /api/tasks/:id
// @desc    Get a task by ID
// @access  Private
router.get('/:id', getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update a task by ID
// @access  Private
router.put('/:id', validateTask, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID
// @access  Private
router.delete('/:id', deleteTask);

module.exports = router;
