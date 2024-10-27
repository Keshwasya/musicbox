const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// API endpoint to fetch a message
app.get('/', (req, res) => {
  console.log('Fetch message request received!!!!!!'); // Log message to backend console
  res.json('Hello, World! Welcome to the Music Album API!'); // Response sent back to the frontend
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
