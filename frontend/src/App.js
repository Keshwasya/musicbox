import React from 'react';
import Routes from './router/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return <Routes />;
}

export default App;


// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [message, setMessage] = useState('');
//   const [fetchStatus, setFetchStatus] = useState('');

//   const fetchData = async () => {
//     setFetchStatus('Fetching...'); // Set fetch status before making the request
//     try {
//       const response = await axios.get('http://localhost:3001'); // Ensure this URL matches your backend
//       setMessage(response.data); // Set the message from the response
//       setFetchStatus('Message fetched successfully!'); // Update status on success
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setFetchStatus('Error fetching message.'); // Update status on error
//     }
//   };

//   return (
//     //NOTE: Move this into it's own js folder for index.html js
//     <div className="App">
//       <h1>Music Album Review Site</h1>
//       <button onClick={fetchData}>Fetch Message</button>
//       <p>{fetchStatus}</p> {/* Display fetch status */}
//       <p>{message}</p> {/* Display the fetched message */}
//     </div>
//   );
// }

// export default App;
