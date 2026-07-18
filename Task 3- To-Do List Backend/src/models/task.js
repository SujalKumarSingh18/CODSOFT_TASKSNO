/**
 * Task Schema and Data Model
 * Stores task-specific details (title, description, completion, priority, due date, category)
 * and references the owning User object to enforce access isolation.
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be either low, medium, or high'
      },
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be linked to a valid User ID'],
      index: true // Indexing user reference for fast queries
    }
  },
  {
    timestamps: true // Automatically creates and updates createdAt and updatedAt fields
  }
);

// Create compound index on user and completed/priority/category for optimized queries
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, category: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
