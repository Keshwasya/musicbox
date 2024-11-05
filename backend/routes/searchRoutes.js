const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getSpotifyAccessToken } = require('../services/spotifyService');

// Search route for albums
router.get('/search', async (req, res) => {
  const { query } = req.query; // Get the search query from request

  if (!query) {
    return res.status(400).json({ error: 'No search query provided' });
  }

  try {
    // Get Spotify access token
    const accessToken = await getSpotifyAccessToken();

    // Make a request to Spotify API for album search
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: 'album',
        limit: 10, // Limit the results to 10 albums
      },
    });

    // Send back the album search results
    res.status(200).json(response.data.albums.items);
  } catch (error) {
    console.error('Error searching Spotify API:', error);
    res.status(500).json({ error: 'Failed to search albums' });
  }
});

module.exports = router;
