const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET

// Register a new user
// authController.js

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a token for the newly registered user
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send a success response with the token and user data
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


// Log in an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Attempting to find user with email:", email);

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log("User found:", user.email);

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password invalid");
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log("Password valid, generating token");

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send both the token and user data in the response
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error); // Log error for debugging
    res.status(500).json({ error: 'Failed to log in' });
  }
};

