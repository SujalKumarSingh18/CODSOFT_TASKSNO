/**
 * Server Entry Point
 * Loads environment variables, connects to the MongoDB database,
 * and starts listening for HTTP requests.
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to Database and start server
const startServer = async () => {
  try {
    // Attempt connecting to database
    await connectDB();
    
    // Boot server and listen for network traffic
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
