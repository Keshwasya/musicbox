import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ type, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = type === 'login' ? `${process.env.REACT_APP_API_URL}/auth/login` : `${process.env.REACT_APP_API_URL}/auth/register`;
      const data = type === 'login' ? { email, password } : { email, password, username };
  
      const response = await axios.post(url, data);
      console.log("Registration/Login response:", response.data); // Log response to confirm data
     
      const { token, user } = response.data;
      console.log("Calling onLogin with user:", user, "and token:", token); // Log onLogin call

      // Store the user ID and token in localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('token', token);
      console.log("User ID:", localStorage.getItem('userId'));
  
      // Call onLogin with user and token
      onLogin(user, token);
      onClose(); // Close modal
    } catch (err) {
      console.error("Error during registration/login:", err.response || err);
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };
  
  


  return (
    <div className="modal show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{type === 'login' ? 'Login' : 'Register'}</h5>
            <button type="button" className="close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {type === 'register' && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control mb-2"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-2"
                required
              />
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary">
                {type === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
