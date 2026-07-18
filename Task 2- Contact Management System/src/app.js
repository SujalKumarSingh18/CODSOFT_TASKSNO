/**
 * @file app.js
 * @description Express application setup, registering parser middleware, loading routes, and mounting central error handlers.
 * @module app
 */

const express = require('express');
const contactsRouter = require('./routes/contacts');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Register built-in middleware for parsing incoming JSON request payloads
app.use(express.json());

/**
 * Health check route to verify that the Express app is running.
 */
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', database: 'Connected' });
});

// Mount modular REST routes
app.use('/api/contacts', contactsRouter);

// Mount centralized global error handling middleware as the last middleware step
app.use(errorHandler);

module.exports = app;
