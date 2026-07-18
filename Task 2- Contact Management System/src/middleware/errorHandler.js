const errorHandler = (err, req, res, next) => {
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

  res.status(500).json({ error: 'Something went wrong on the server!' });
};

module.exports = errorHandler;
