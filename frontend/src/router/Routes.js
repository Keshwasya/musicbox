import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage';
import SearchPage from '../components/search/SearchPage'; // Import SearchPage

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<SearchPage />} /> {/* Add SearchPage route */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
