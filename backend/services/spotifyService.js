const axios = require('axios');
const querystring = require('querystring');

// Get Spotify access token
async function getSpotifyAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
              'base64'
            ),
        },
      }
    );

    console.log('Spotify Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response?.data || error);
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

module.exports = { getAlbumData };
