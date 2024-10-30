import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');

  const fetchPopularAlbums = async () => {
    setFetchStatus('Fetching popular albums...');
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlbums(data.albums.items);
      setFetchStatus('');
    } catch (error) {
      console.error("Error fetching popular albums:", error);
      setFetchStatus('Error fetching popular albums.');
    }
  };

  const fetchTopArtistsByGenre = async (genre) => {
    setFetchStatus('Fetching top artists...');
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setArtists(data.artists.items);
      setFetchStatus('');
    } catch (error) {
      console.error("Error fetching top artists:", error);
      setFetchStatus('Error fetching top artists.');
    }
  };

  useEffect(() => {
    fetchPopularAlbums();
    fetchTopArtistsByGenre("pop");
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Musicbox</h1>
      {fetchStatus && <p className="text-center text-muted">{fetchStatus}</p>}

      {/* Top Albums Section */}
      <h2 className="mt-5">Top Albums</h2>
      <div className="scroll-container">
        {albums.map(album => (
          <a
            key={album.id}
            href={`https://open.spotify.com/album/${album.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card album-card"
            style={{ textDecoration: 'none', color: 'inherit' }} // Ensures link styling doesn’t affect the card appearance
          >
            <img src={album.images[0]?.url} className="card-img-top" alt={album.name} />
            <div className="card-body">
              <h5 className="card-title">{album.name}</h5>
              <p className="card-text">By {album.artists[0].name}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Top Artists Section */}
      <h2 className="mt-5">Top Artists</h2>
      <div className="scroll-container">
        {artists.map(artist => (
          <a
            key={artist.id}
            href={`https://open.spotify.com/artist/${artist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card artist-card"
            style={{ textDecoration: 'none', color: 'inherit' }}  // Ensures link styling doesn’t affect the card appearance
          >
            <img src={artist.images[0]?.url} className="card-img-top" alt={artist.name} />
            <div className="card-body">
              <h5 className="card-title">{artist.name}</h5>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
