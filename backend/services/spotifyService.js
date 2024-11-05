const axios = require('axios');
const querystring = require('querystring');

let cachedToken = null;
let tokenExpiry = null;

// Get Spotify access token
async function getSpotifyAccessToken() {
  // If the token is still valid, return it
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Cache the token and set the expiry time
    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return cachedToken;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    throw new Error('Failed to fetch Spotify access token');
  }
}


// Get album data from Spotify
async function getAlbumData(albumId) {
  try {
    const token = await getSpotifyAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Album Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching album data from Spotify:', error.response?.data || error);
    throw new Error('Failed to fetch album data');
  }
}

module.exports = { getAlbumData, getSpotifyAccessToken };
