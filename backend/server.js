require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/api', searchRoutes);

// Catch all other routes and serve the frontend
app.get('*', (req, res) => {
  // Serve index.html only for non-API routes
  if (!req.path.startsWith('/auth') && !req.path.startsWith('/users')) {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
  } else {
    res.status(404).send('API route not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
