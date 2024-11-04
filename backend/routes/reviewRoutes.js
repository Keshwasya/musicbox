const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new review (requires authentication)
router.post('/albums/:id/review', authMiddleware, reviewController.createReview);

// Update a review (requires authentication)
router.patch('/:id', authMiddleware, reviewController.updateReview);

// Delete a review (requires authentication)
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
