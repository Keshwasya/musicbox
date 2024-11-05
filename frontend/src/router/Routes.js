import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage';
import SearchPage from '../components/search/SearchPage';

function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Homepage user={user} onLogin={onLogin} onLogout={onLogout} />} />
      <Route path="/search" element={<SearchPage user={user} onLogin={onLogin} onLogout={onLogout} />} />
    </Routes>
  );
}

export default AppRoutes;
