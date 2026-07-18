/**
 * @file server_memory.js
 * @description In-memory development server entry point for To-Do List Backend.
 * Automatically provisions an in-memory MongoDB instance and starts the API server.
 * Ideal for testing endpoints using test.http without needing a local/external MongoDB database service running.
 */

require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

/**
 * Boots the in-memory MongoDB database and launches the Express API server.
 */
const startMemoryServer = async () => {
  try {
    console.log('Starting in-memory MongoDB database...');
    
    // Create the in-memory MongoDB instance
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Override MONGODB_URI environment variable
    process.env.MONGODB_URI = uri;
    
    // Connect Mongoose to the memory database instance
    await mongoose.connect(uri);
    console.log('MongoDB Connected: In-Memory DB');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
      console.log('Ready to receive requests. State will persist until the server is stopped.');
    });
  } catch (error) {
    console.error(`Failed to start memory server: ${error.message}`);
    process.exit(1);
  }
};

startMemoryServer();
