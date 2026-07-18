/**
 * @file server.js
 * @description Main entry point of the Contact Management System application.
 * Loads environment variables, connects to the database, and boots the HTTP server.
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

/**
 * Initializes database connection and starts listening for HTTP requests on the configured port.
 * 
 * @async
 * @function startServer
 */
const startServer = async () => {
  try {
    // Establish database connection
    await connectDB();
    
    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
