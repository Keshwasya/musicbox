const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userAlbumController = require('../controllers/userAlbumController');


const router = express.Router();

// Retrieve user profile data (including followers, backlog, and current rotation)
router.get('/:id', authMiddleware, userController.getUserProfile);

// Update user profile information (profile picture, bio, etc.)
router.patch('/:id', authMiddleware, userController.updateUser);

// Follow a user
router.post('/:id/follow', authMiddleware, userController.followUser);

// Unfollow a user
router.delete('/:id/unfollow', authMiddleware, userController.unfollowUser);

// Backlog routes
router.post('/:userId/backlog', authMiddleware, userAlbumController.addToBacklog);
router.delete('/:userId/backlog/:albumId', authMiddleware, userAlbumController.removeFromBacklog);

// Current Rotation routes
router.post('/:userId/rotation', authMiddleware, userAlbumController.addToCurrentRotation);
router.delete('/:userId/rotation/:albumId', authMiddleware, userAlbumController.removeFromCurrentRotation);

module.exports = router;
