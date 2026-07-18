require('dotenv').config();
const app = require('./app');

// Retrieve Port from environment variables
const PORT = process.env.PORT || 3000;

// Start the Express server and listen on the configured port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
