/**
 * @file errorHandler.js
 * @description Centralized Express error-handling middleware that catches all unhandled routing or database errors,
 * formatting database-specific constraints (e.g. unique violations) into readable JSON error responses.
 * @module middleware/errorHandler
 */

/**
 * Express Error Handling Middleware.
 * 
 * @function errorHandler
 * @param {Error} err - The error object intercepted from previous route handlers or middleware.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function callback.
 */
const errorHandler = (err, req, res, next) => {
  // Logs the full error stack to console for debugging purposes
  console.error(err.stack || err);

  // Mongoose duplicate key error (MongoDB error code 11000)
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    return res.status(400).json({
      error: `Duplicate value error: A contact with this ${key} (${value}) already exists.`
    });
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid format for field '${err.path}'` });
  }

  // Fallback for general unhandled server exceptions
  res.status(500).json({ error: 'Something went wrong on the server!' });
};

module.exports = errorHandler;
