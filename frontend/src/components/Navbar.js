import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './search/SearchBar';

const Navbar = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#333333' }}>
      <a className="navbar-brand" href="/">Musicbox</a>
      <div className="collapse navbar-collapse">
        <div className="ml-auto mr-3">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="justify-content-end">
          {user ? (
            <div className="navbar-text">
              Welcome, {user.username}!
              <button className="btn btn-secondary ml-2" onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline-primary mr-2" onClick={() => onLogin('login')}>Login</button>
              <button className="btn btn-outline-success" onClick={() => onLogin('register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
