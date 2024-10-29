import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Homepage() {
  const [message, setMessage] = useState('');
  const [fetchStatus, setFetchStatus] = useState('');

  const fetchData = async () => {
    setFetchStatus('Fetching...');
    try {
      const response = await axios.get('http://localhost:3001');
      setMessage(response.data);
      setFetchStatus('Message fetched successfully!');
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchStatus('Error fetching message.');
    }
  };

  const fetchAlbumData = async (albumName) => {
    setFetchStatus('Fetching album data...');
    try {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumName}&api_key=834e7e36c22ff83a05ebd995dbeed7a2&format=json`
      );
      setMessage(JSON.stringify(response.data.results));
      setFetchStatus('Album data fetched successfully!');
    } catch (error) {
      console.error("Error fetching album data:", error);
      setFetchStatus('Error fetching album data.');
    }
  };

  useEffect(() => {
    fetchAlbumData('Flower Boy'); // Replace with any album name you'd like to load by default
  }, []);

  return (
    <div className="App">
      <h1>Music Album Review Site</h1>
      <button onClick={fetchData}>Fetch Message</button>
      <p>{fetchStatus}</p>
      <p>{message}</p>
    </div>
  );
}

export default Homepage;
