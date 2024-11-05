import React, { useState, useEffect } from 'react';
import Routes from './router/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in by verifying token and user data in local storage
    const token = localStorage.getItem('token');
    let userData = localStorage.getItem('user');

    console.log("Raw user data from localStorage:", userData); // Log raw user data for debugging

    // Only proceed if userData is a valid JSON string
    if (token && userData && userData !== "undefined") {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        // If parsing fails, clear the invalid user data from localStorage
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    console.log("User data received on login:", userData); // Log user data
    setUser(userData);
    localStorage.setItem('token', token); // Save token for session persistence
    localStorage.setItem('user', JSON.stringify(userData)); // Save user info for display
  };
  
  

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return <Routes user={user} onLogin={handleLogin} onLogout={handleLogout} />;
}

export default App;
