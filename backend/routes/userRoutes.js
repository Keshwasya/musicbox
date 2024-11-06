const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userAlbumController = require('../controllers/userAlbumController');

const router = express.Router();

// User feed route
router.get('/:id/feed', authMiddleware, userController.getUserFeed);

// Retrieve user profile data (including followers, backlog, and current rotation)
router.get('/:id', authMiddleware, userController.getUserProfile);

// Update user profile information (profile picture, bio, etc.)
router.patch('/:id', authMiddleware, userController.updateUser);

// Follow a user
router.post('/:id/follow', authMiddleware, userController.followUser);

// Unfollow a user
router.delete('/:id/unfollow', authMiddleware, userController.unfollowUser);

// Backlog routes
router.post('/:id/backlog', authMiddleware, userAlbumController.addToBacklog);
router.delete('/:id/backlog/:albumId', authMiddleware, userAlbumController.removeFromBacklog);
router.get('/:id/backlog', authMiddleware, userAlbumController.getUserBacklog);

// Current Rotation routes
router.post('/:id/rotation', authMiddleware, userAlbumController.addToCurrentRotation);
router.delete('/:id/rotation/:albumId', authMiddleware, userAlbumController.removeFromCurrentRotation);
router.get('/:id/current-rotation', authMiddleware, userAlbumController.getUserCurrentRotation);

// Other user data routes
router.get('/:id/followers-following', authMiddleware, userController.getFollowersAndFollowing); // Get followers and following
router.get('/:id/recent-reviews', authMiddleware, userController.getUserFeed); // Get recent reviews from followed users

module.exports = router;
