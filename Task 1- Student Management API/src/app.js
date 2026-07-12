const express = require('express');
const db = require('./config/database'); // Imports and runs DB initialization

const app = express();

// 1. TODO: Enable parsing of JSON request bodies.
// Hint: Express has a built-in middleware for parsing application/json.
app.use(express.json());

// Basic status check route
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'Connected' });
});

// TODO: Import and use routes once we create them.
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// 2. TODO: Implement the global error handling middleware.
// Hint: In Express, an error-handling middleware has exactly four arguments: (err, req, res, next).
// It should catch all unhandled errors, log the error, and return a 500 status code with a clean error message.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
