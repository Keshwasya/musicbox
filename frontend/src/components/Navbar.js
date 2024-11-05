import React from 'react';

const Navbar = ({ user, onLogin, onLogout }) => {
  console.log("Navbar re-rendered with user:", user); // Log user state in Navbar

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Musicbox</a>
      <div className="collapse navbar-collapse justify-content-end">
        {user ? (
          <div className="navbar-text">
            Welcome, {user.username}!
            <button className="btn btn-secondary ml-2" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-outline-primary mr-2"
              onClick={() => onLogin('login')}
            >
              Login
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => onLogin('register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
