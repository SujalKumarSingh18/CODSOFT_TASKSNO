/**
 * Express Application Setup
 * Configures application middleware, mounts Swagger interactive API docs,
 * loads controllers/routers, and handles uncaught route exceptions.
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Import central error handler middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parse application/json request payloads
app.use(express.json());

// Expose interactive Swagger/OpenAPI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Standard service status health-check route
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'To-Do List Backend API',
    documentation: '/api-docs'
  });
});

// Mount routing modules
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback for non-matching URLs
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error interceptor (MUST be defined after all routes)
app.use(errorHandler);

module.exports = app;
