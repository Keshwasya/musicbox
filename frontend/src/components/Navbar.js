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

  const goToUserPage = () => {
    navigate('/user'); // Redirect to user page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#333333' }}>
      <div className="container-fluid">
        {/* Brand Name */}
        <a className="navbar-brand" href="/">Musicbox</a>

        {/* Search Bar - aligned to the right of the brand */}
        <div className="d-flex align-items-center ms-3">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Right-aligned user button and logout button */}
        <div className="ms-auto d-flex align-items-center">
          {user ? (
            <>
              {/* User button with dark outline */}
              <button className="btn btn-outline-light me-2" onClick={goToUserPage}>
                {user.username}
              </button>
              
              {/* Logout button with red outline */}
              <button className="btn btn-outline-danger" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-light me-2" onClick={() => onLogin('login')}>Login</button>
              <button className="btn btn-outline-success" onClick={() => onLogin('register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
