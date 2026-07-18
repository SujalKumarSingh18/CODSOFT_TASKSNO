/**
 * Centralized Global Error Handler Middleware
 * Catches all runtime route and database errors, logging stack traces
 * and returning consistent JSON error envelopes to clients.
 */

const errorHandler = (err, req, res, next) => {
  // Log full error stack for backend troubleshooting
  console.error(err.stack || err);

  // 1. Mongoose duplicate key error (e.g. User registering with an email already taken)
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];
    return res.status(400).json({
      error: `Duplicate value error: An account with this ${key} (${value}) already exists.`
    });
  }

  // 2. Mongoose schema validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // 3. Mongoose CastError (e.g. User requests Task by an invalid MongoDB ObjectId structure)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid format for field '${err.path}'` });
  }

  // 4. JSON body parser syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON request body syntax' });
  }

  // Default: Internal Server Error
  res.status(500).json({ error: 'Something went wrong on the server!' });
};

module.exports = errorHandler;
