import React, { useState } from 'react';
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
