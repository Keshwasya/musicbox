import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage';
import SearchPage from '../components/search/SearchPage';
import UserPage from '../components/UserPage'; // Import the UserPage component

function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage user={user} onLogin={onLogin} onLogout={onLogout} />} />
      <Route path="/search" element={<SearchPage user={user} onLogin={onLogin} onLogout={onLogout} />} />
      <Route path="/user" element={<UserPage user={user} />} /> {/* Add UserPage route */}
    </Routes>
  );
}

export default AppRoutes;
