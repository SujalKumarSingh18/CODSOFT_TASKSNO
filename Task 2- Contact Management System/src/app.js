const express = require('express');
const contactsRouter = require('./routes/contacts');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Basic status check route
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'Connected' });
});

// Register contact API routes
app.use('/api/contacts', contactsRouter);

// Register global error handler middleware
app.use(errorHandler);

module.exports = app;
