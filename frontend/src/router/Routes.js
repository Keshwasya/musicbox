import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage';
import SearchPage from '../components/search/SearchPage';

function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage user={user} onLogin={onLogin} onLogout={onLogout} />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
