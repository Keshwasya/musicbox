const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// API endpoint to fetch a message 
//NOTE: create a routes or controllers directory to handle all the endpoints/routes 
// (like /albums, /reviews) but also handles CRUD operations 
// (Create, Read, Update, Delete) related to albums, users, or reviews.

app.get('/', (req, res) => {
  console.log('Fetch message request received!!!!!!'); // Log message to backend console
  res.json('Hello, World! Welcome to the Music Album API!'); // Response sent back to the frontend
  //res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

//catch all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});


// Starts the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
