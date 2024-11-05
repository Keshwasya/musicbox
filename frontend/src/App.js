import React, { useState, useEffect } from 'react';
import Routes from './router/Routes';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';

function App() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const token = localStorage.getItem('token');
    let userData = localStorage.getItem('user');

    if (token && userData && userData !== "undefined") {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsModalOpen(false); // Close the modal after logging in
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <Navbar user={user} onLogin={() => openModal('login')} onLogout={handleLogout} />
      <Routes user={user} onLogin={handleLogin} onLogout={handleLogout} />
      
      {isModalOpen && (
        <AuthModal
          type={modalType}
          onClose={closeModal}
          onLogin={handleLogin}
        />
      )}
    </Router>
  );
}

export default App;
