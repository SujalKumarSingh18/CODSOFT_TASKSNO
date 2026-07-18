/**
 * @file db.js
 * @description Configuration module for establishing a connection to the MongoDB database using Mongoose.
 * @module config/db
 */

const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 * Uses the MONGODB_URI environment variable, falling back to a local database instance.
 * Exits the process with status code 1 if the connection fails.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<mongoose.Connection>} The mongoose connection instance.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contact_manager');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
