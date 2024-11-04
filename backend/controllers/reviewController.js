const { Review, Album } = require('../models');
const { getAlbumData } = require('../services/spotifyService');

exports.createReview = async (req, res) => {
    const { id: spotifyAlbumId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;
  
    try {
      // Log to ensure we're getting the album ID and review details
      console.log('Spotify Album ID:', spotifyAlbumId);
      console.log('Review Content:', content);
      console.log('Review Rating:', rating);
  
      // Fetch album data from Spotify
      const albumData = await getAlbumData(spotifyAlbumId);
      console.log('Album data from Spotify:', albumData); // Log album data
  
      // Create the review, storing the Spotify album ID in the albumId field
      const newReview = await Review.create({
        userId,
        albumId: spotifyAlbumId,
        content,
        rating,
      });
  
      // Send the response with review and album data
      res.status(201).json({ review: newReview, album: albumData });
    } catch (error) {
      console.error('Error creating review:', error); // Log detailed error
      res.status(500).json({ error: 'Failed to create review' });
    }
  };
  

// Update an existing review
exports.updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.id;

  try {
    // Find the review
    const review = await Review.findOne({ where: { id: reviewId, userId } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you are not authorized to update this review' });
    }

    // Update the review
    await review.update({ content, rating });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.user.id;

  try {
    // Find the review
    const review = await Review.findOne({ where: { id: reviewId, userId } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found or you are not authorized to delete this review' });
    }

    // Delete the review
    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
