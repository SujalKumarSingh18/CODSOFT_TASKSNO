require('dotenv').config();
const app = require('./app');

// Retrieve Port from environment variables
const PORT = process.env.PORT || 3000;

// TODO: Start the Express server and listen on the configured PORT.
// Hint: Use app.listen(PORT, callback) to start the server.
// Log a message to the console once the server is successfully running (e.g., "Server running on port 3000")
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
