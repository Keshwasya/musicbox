import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchResults = ({ results }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [backlog, setBacklog] = useState([]);
  const [currentRotation, setCurrentRotation] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserBacklog();
      fetchUserCurrentRotation();
    }
  }, [isLoggedIn]);

  const fetchUserBacklog = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/backlog`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Store each album as an object with id and title
        setBacklog(response.data.map(album => ({ id: album.id, title: album.title })));
    } catch (error) {
        console.error('Error fetching backlog:', error);
    }
};

const fetchUserCurrentRotation = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/current-rotation`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Store each album as an object with id and title
        setCurrentRotation(response.data.map(album => ({ id: album.id, title: album.title })));
    } catch (error) {
        console.error('Error fetching current rotation:', error);
    }
};


  
  
  const handleAlbumClick = async (album) => {
    if (isLoggedIn) {
      await fetchUserBacklog();  // Wait for backlog to be fetched
      await fetchUserCurrentRotation();  // Wait for rotation to be fetched
      setSelectedAlbum(album);  // Set selected album after data is fetched
      console.log("Backlog after fetch:", backlog);
      console.log("Current Rotation after fetch:", currentRotation);
      console.log("Selected Album title:", album.name);
    } else {
      setAlert({ message: 'Please log in to access album options.', type: 'danger' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };
  

  const handleClosePopup = () => {
    setSelectedAlbum(null);
  };

  const handleAddOrRemoveBacklog = async () => {
      const token = localStorage.getItem('token');
      try {
          const existingAlbum = backlog.find(album => album.title === selectedAlbum.name);
          if (existingAlbum) {
              await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}/backlog/${existingAlbum.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album removed from backlog', type: 'success' });
              setBacklog(backlog.filter(album => album.id !== existingAlbum.id));
          } else {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/backlog`, {
                  albumTitle: selectedAlbum.name
              }, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album added to backlog', type: 'success' });
              setBacklog([...backlog, { id: response.data.id, title: selectedAlbum.name }]);
          }
      } catch (error) {
          console.error('Error updating backlog:', error);
          setAlert({ message: 'Failed to update backlog', type: 'danger' });
      }
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };



  const handleAddOrRemoveCurrentRotation = async () => {
      const token = localStorage.getItem('token');
      try {
          const existingAlbum = currentRotation.find(album => album.title === selectedAlbum.name);
          if (existingAlbum) {
              await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}/current-rotation/${existingAlbum.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album removed from current rotation', type: 'success' });
              setCurrentRotation(currentRotation.filter(album => album.id !== existingAlbum.id));
          } else {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/current-rotation`, {
                  albumTitle: selectedAlbum.name
              }, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album added to current rotation', type: 'success' });
              setCurrentRotation([...currentRotation, { id: response.data.id, title: selectedAlbum.name }]);
          }
      } catch (error) {
          console.error('Error updating current rotation:', error);
          setAlert({ message: 'Failed to update current rotation', type: 'danger' });
      }
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };



  
  

  const handleOpenInSpotify = () => {
    window.open(selectedAlbum.external_urls.spotify, '_blank');
  };

  const handleCreateReview = (album) => {
    console.log(`Creating review for album: ${album.name}`);
  };

  return (
    <div className="container my-4">
      {alert.message && (
        <div
          className={`alert alert-${alert.type} position-fixed top-0 start-50 translate-middle-x mt-3 text-center`}
          style={{ zIndex: 1060, width: '80%' }}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      <div className="row justify-content-center">
        {results.length === 0 ? (
          <p className="text-muted">No results found.</p>
        ) : (
          results.map((album) => (
            <div className="col-md-4 mb-4" key={album.id}>
              <div
                className="card h-100 shadow-sm"
                onClick={() => handleAlbumClick(album)}
                style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}
              >
                <div
                  className="card-img-top d-flex align-items-center justify-content-center"
                  style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  <img
                    src={album.images[0]?.url}
                    alt={album.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{album.name}</h5>
                  <p className="card-text"><strong>Artist:</strong> {album.artists[0].name}</p>
                  <p className="card-text"><strong>Release Date:</strong> {new Date(album.release_date).getFullYear()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedAlbum && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        onClick={handleClosePopup}
      >
        <div
          className="bg-white rounded p-4 shadow-lg text-center"
          style={{ width: '300px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <h4>{selectedAlbum.name} Options</h4>

          <button className="btn btn-primary w-100 mb-2" onClick={() => handleCreateReview(selectedAlbum)}>Create Review</button>

          {/* Add console log to check backlog and current rotation */}
          {console.log("Checking if album is in backlog:", selectedAlbum.name)}
          {console.log("Backlog contains:", backlog)}
          {console.log("Current Rotation contains:", currentRotation)}

          <button
              className="btn btn-secondary w-100 mb-2"
              onClick={handleAddOrRemoveBacklog}
          >
              {backlog.some(album => album.title === selectedAlbum.name) ? 'Remove from Backlog' : 'Add to Backlog'}
          </button>

          <button
              className="btn btn-secondary w-100 mb-2"
              onClick={handleAddOrRemoveCurrentRotation}
          >
              {currentRotation.some(album => album.title === selectedAlbum.name) ? 'Remove from Current Rotation' : 'Add to Current Rotation'}
          </button>


          <button className="btn btn-success w-100" onClick={handleOpenInSpotify}>Open in Spotify</button>
          <button className="btn btn-light w-100 mt-2" onClick={handleClosePopup}>Close</button>
        </div>
      </div>
    )}



    </div>
  );
};

export default SearchResults;
