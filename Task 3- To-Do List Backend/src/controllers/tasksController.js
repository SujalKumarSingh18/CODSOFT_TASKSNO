/**
 * Tasks Controller
 * Implements CRUD operations, searching, filtering, pagination, and sorting for tasks.
 * All DB queries enforce user isolation to prevent cross-tenant data access.
 */

const Task = require('../models/task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  const { title, description, completed, priority, dueDate, category } = req.body;

  try {
    // Instantiate new task linked to the authenticated user's ID
    const task = new Task({
      title,
      description,
      completed,
      priority,
      dueDate: dueDate || null,
      category,
      user: req.user.id // Linked to jwt user ID
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks with filtering, searching, sorting, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // 1. Build Query Object (Enforce user isolation)
    const query = { user: req.user.id };

    // 2. Filtering by Completion status
    if (req.query.completed !== undefined) {
      query.completed = req.query.completed === 'true';
    }

    // 3. Filtering by Priority level
    if (req.query.priority) {
      query.priority = req.query.priority.toLowerCase();
    }

    // 4. Filtering by Category
    if (req.query.category) {
      query.category = { $regex: new RegExp('^' + req.query.category.trim() + '$', 'i') }; // Case-insensitive exact match
    }

    // 5. Searching (matches query inside title or description)
    const searchString = req.query.q || req.query.search;
    if (searchString && searchString.trim() !== '') {
      const escapedSearch = searchString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // Escape regex chars
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } }
      ];
    }

    // 6. Sorting
    let sort = {};
    if (req.query.sortBy) {
      const order = req.query.order === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = order;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    // 7. Pagination Setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 8. Execute count & retrieval queries
    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // 9. Format response including pagination metadata
    res.status(200).json({
      tasks,
      pagination: {
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  const taskId = req.params.id;

  try {
    // Find task by ID and user ID
    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task by ID
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  const taskId = req.params.id;
  const { title, description, completed, priority, dueDate, category } = req.body;

  try {
    // Find the task and verify ownership
    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Apply updates
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority.toLowerCase();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) task.category = category;

    // Save task (triggers validation schema checks)
    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  const taskId = req.params.id;

  try {
    // Find and delete the task (ensuring user matches)
    const result = await Task.findOneAndDelete({ _id: taskId, user: req.user.id });

    if (!result) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
