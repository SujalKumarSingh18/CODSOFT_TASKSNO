const express = require('express');
const db = require('./config/database'); // Imports and runs DB initialization

const app = express();

// Enable parsing of incoming JSON request payloads
app.use(express.json());

// Basic status check route
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'Connected' });
});

// Load and mount API route handlers
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const errorHandler = require('./middleware/errorHandler');

// Register global centralized error-handling middleware
app.use(errorHandler);

module.exports = app;
