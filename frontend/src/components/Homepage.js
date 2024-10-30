import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');

  // Function to fetch popular albums (new releases)
  const fetchPopularAlbums = async () => {
    setFetchStatus('Fetching popular albums...');
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlbums(data.albums.items);
      setFetchStatus('Popular albums fetched successfully!');
    } catch (error) {
      console.error("Error fetching popular albums:", error);
      setFetchStatus('Error fetching popular albums.');
    }
  };

  // Function to fetch top artists by genre (e.g., pop)
  const fetchTopArtistsByGenre = async (genre) => {
    setFetchStatus('Fetching top artists...');
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setArtists(data.artists.items);
      setFetchStatus('Top artists fetched successfully!');
    } catch (error) {
      console.error("Error fetching top artists:", error);
      setFetchStatus('Error fetching top artists.');
    }
  };

  // Fetch both popular albums and artists on component mount
  useEffect(() => {
    fetchPopularAlbums();
    fetchTopArtistsByGenre("pop"); // Replace "pop" with any genre you prefer
  }, []);

  return (
    <div className="App">
      <h1>Music Album Review Site</h1>
      <p>{fetchStatus}</p>

      <h2>Top Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            {album.name} by {album.artists[0].name}
            <img src={album.images[0]?.url} alt={album.name} width="100" />
          </li>
        ))}
      </ul>

      <h2>Top Artists</h2>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}
            <img src={artist.images[0]?.url} alt={artist.name} width="100" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;
