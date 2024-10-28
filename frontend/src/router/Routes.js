import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../components/Homepage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes
