import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/spotifyAuth';

function Homepage() {
  const [album, setAlbum] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('');

  const fetchAlbumData = async (albumId) => {
    setFetchStatus('Fetching album...');
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlbum(data);
      setFetchStatus('Album fetched successfully!');
    } catch (error) {
      console.error("Error fetching album:", error);
      setFetchStatus('Error fetching album.');
    }
  };

  useEffect(() => {
    fetchAlbumData('4aawyAB9vmqN3uQ7FjRGTy'); // example album ID
  }, []);

  return (
    <div className="App">
      <h1>Music Album Review Site</h1>
      <p>{fetchStatus}</p>
      {album && (
        <div>
          <h2>{album.name}</h2>
          <img src={album.images[0]?.url} alt={album.name} width="200" />
        </div>
      )}
    </div>
  );
}

export default Homepage;
