const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful. Please delete the token on client side.' });
  });

module.exports = router;
