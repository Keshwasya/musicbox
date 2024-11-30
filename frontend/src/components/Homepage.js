import React, { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';
import { albums1001 } from '../data/albums1001';
import AuthModal from './AuthModal';
import axios from 'axios';

function Homepage({ user, onLogin, onLogout }) {
  const [newAlbumReleases, setNewAlbumReleases] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);
  const [modalType, setModalType] = useState(null); 
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [backlog, setBacklog] = useState([]);
  const [currentRotation, setCurrentRotation] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const userId = localStorage.getItem('userId');

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleAlbumClick = async (album) => {
      setSelectedAlbum(album);
  };

  const handleClosePopup = () => {
      setSelectedAlbum(null);
  };

  // Add/remove album in the backlog
  const handleAddOrRemoveBacklog = async () => {
      const token = localStorage.getItem('token');
      try {
          const existingAlbum = backlog.find(album => album.title === selectedAlbum.name);
          if (existingAlbum) {
              const deleteUrl = `${process.env.REACT_APP_API_URL}/users/${userId}/backlog/${existingAlbum.id}`;
              console.log('DELETE request URL:', deleteUrl);
              await axios.delete(deleteUrl, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album removed from backlog', type: 'success' });
              setBacklog(backlog.filter(album => album.id !== existingAlbum.id));
          } else {
              const postUrl = `${process.env.REACT_APP_API_URL}/users/${userId}/backlog`;
              const response = await axios.post(postUrl, {
                  spotifyAlbumId: selectedAlbum.id
              }, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log("Backend response data:", response.data);  // Log backend response
              setAlert({ message: 'Album added to backlog', type: 'success' });
              setBacklog([...backlog, { id: response.data.album.id, title: selectedAlbum.name }]);
          }
      } catch (error) {
          console.error('Error updating backlog:', error);
          setAlert({ message: 'Failed to update backlog', type: 'danger' });
      }
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      handleClosePopup();
  };

  const handleAddOrRemoveCurrentRotation = async () => {
      const token = localStorage.getItem('token');
      try {
          const existingAlbum = currentRotation.find(album => album.title === selectedAlbum.name);
          if (existingAlbum) {
              const deleteUrl = `${process.env.REACT_APP_API_URL}/users/${userId}/rotation/${existingAlbum.id}`;
              console.log('DELETE request URL:', deleteUrl);
              await axios.delete(deleteUrl, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setAlert({ message: 'Album removed from current rotation', type: 'success' });
              setCurrentRotation(currentRotation.filter(album => album.id !== existingAlbum.id));
          } else {
              const postUrl = `${process.env.REACT_APP_API_URL}/users/${userId}/rotation`;
              const response = await axios.post(postUrl, {
                  spotifyAlbumId: selectedAlbum.id
              }, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              console.log("Backend response data:", response.data);  // Log backend response
              setAlert({ message: 'Album added to current rotation', type: 'success' });
              setCurrentRotation([...currentRotation, { id: response.data.album.id, title: selectedAlbum.name }]);
          }
      } catch (error) {
          console.error('Error updating current rotation:', error);
          setAlert({ message: 'Failed to update current rotation', type: 'danger' });
      }
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      handleClosePopup();
  };


  // Open Spotify with fallback
  const handleOpenInSpotify = () => {
    const spotifyUri = `spotify:album:${selectedAlbum.id}`;
    const webUrl = selectedAlbum.external_urls.spotify;
    
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    
    if (isDesktop) {
        const appWindow = window.open(spotifyUri, '_self');
        setTimeout(() => {
            if (document.hasFocus()) {
                window.open(webUrl, '_blank');
            }
        }, 1500);
    } else {
        window.open(webUrl, '_blank');
    }
    handleClosePopup();
  };

  // Fetch New Album Releases
  const fetchNewAlbumReleases = async () => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNewAlbumReleases(data.albums.items);
    } catch (error) {
      console.error("Error fetching new album releases:", error);
    }
  };

  // Fetch Trending Artists
  const fetchTrendingArtists = async () => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTrendingArtists(data.artists.items);
    } catch (error) {
      console.error("Error fetching trending artists:", error);
    }
  };

  // Fetch Trending Albums from Popular Playlists
  const fetchTrendingAlbums = async () => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      const playlistAlbumPromises = data.playlists.items.map(async (playlist) => {
        const playlistResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        const playlistData = await playlistResponse.json();
        return playlistData.items.map(item => ({
          album: item.track.album,
          imageUrl: item.track.album.images[0]?.url || playlist.images[0]?.url
        }));
      });

      const albumDataArrays = await Promise.all(playlistAlbumPromises);
      const allAlbums = albumDataArrays.flat();

      const uniqueAlbums = [];
      allAlbums.forEach(({ album, imageUrl }) => {
        if (album && !uniqueAlbums.some(a => a.album.id === album.id)) {
          uniqueAlbums.push({ album, imageUrl });
        }
      });
      setTrendingAlbums(uniqueAlbums.slice(0, 20));
    } catch (error) {
      console.error("Error fetching trending albums:", error);
    }
  };

  const fetchAlbumDetails = async (album) => {
      const token = await getAccessToken();
      try {
          const query = `album:${encodeURIComponent(album.album)} artist:${encodeURIComponent(album.artist)}`;
          let response = await fetch(
              `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
              { headers: { Authorization: `Bearer ${token}` } }
          );
        
          let data = await response.json();
        
          let spotifyAlbum = data.albums.items.find(
              (item) =>
                  item.name.toLowerCase() === album.album.toLowerCase() &&
                  item.artists.some((artist) => artist.name.toLowerCase() === album.artist.toLowerCase())
          );
        
          if (!spotifyAlbum) {
              response = await fetch(
                  `https://api.spotify.com/v1/search?q=album:${encodeURIComponent(album.album)}&type=album&limit=10`,
                  { headers: { Authorization: `Bearer ${token}` } }
              );
              data = await response.json();
        
              spotifyAlbum = data.albums.items.find(
                  (item) =>
                      item.artists.some((artist) => artist.name.toLowerCase() === album.artist.toLowerCase())
              );
          }
        
          if (spotifyAlbum) {
              const releaseDate = spotifyAlbum.release_date;
              const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;
              const spotifyUri = `spotify:album:${spotifyAlbum.id}`;
              const spotifyLink = spotifyAlbum.external_urls.spotify;
        
              return {
                  id: album.id,
                  artist: album.artist,
                  album: album.album,
                  year: releaseYear,
                  cover: spotifyAlbum.images[0]?.url,
                  spotifyUri, // Add Spotify URI
                  spotifyLink, // Add Spotify Link
              };
          }
      } catch (error) {
          console.error("Error fetching album details from Spotify:", error);
      }
      return album; // Return original album data if Spotify details are not found
  };


  const fetchRandomRecommendations = useCallback(async () => {
    const priorityAlbumName = "";
    const priorityAlbum = albums1001.find(album => album.album === priorityAlbumName);
    let shuffledAlbums = albums1001.filter(album => album.album !== priorityAlbumName).sort(() => 0.5 - Math.random()).slice(0, 19);

    if (priorityAlbum) {
        shuffledAlbums = [priorityAlbum, ...shuffledAlbums];
    }

    const albumDetailsPromises = shuffledAlbums.map(album => fetchAlbumDetails(album));
    const albumsWithDetails = await Promise.all(albumDetailsPromises);
    setRecommendedAlbums(albumsWithDetails);
}, []);


  const openSpotifyLink = (spotifyUri, webUrl) => (event) => {
    event.preventDefault();
  
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
  
    if (isDesktop) {
      const appWindow = window.open(spotifyUri, '_self');
      setTimeout(() => {
        if (document.hasFocus()) {
          window.open(webUrl, '_blank');
        }
      }, 1500);
    } else {
      window.open(webUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchNewAlbumReleases();
    fetchTrendingArtists();
    fetchTrendingAlbums();
    fetchRandomRecommendations();
  }, [fetchRandomRecommendations]);

  return (
    <div>      
      {/* Auth Modal */}
      {modalType && <AuthModal type={modalType} onClose={closeModal} onLogin={onLogin} />}

      {/* Banner content */}
      <div className="container text-center banner-container my-4">
        <h1 className="display-4">Welcome to Musicbox</h1>
        <p className="lead">By Keshwasya Singh</p>
        <hr className="my-2" />
        <h3>Tech Stack:</h3>
        <ul className="list-unstyled">
          <li><strong>Frontend:</strong> React, Bootstrap</li>
          <li><strong>Backend:</strong> Node.js, Express, Sequelize</li>
          <li><strong>Authentication:</strong> JSON Web Tokens (JWT), bcrypt</li>
          <li><strong>Database:</strong> PostgreSQL</li>
          <li><strong>Special Feature:</strong> Spotify API Integration</li>
          <li><strong>Deployment:</strong> Vercel (Frontend) and Render (Backend & PostgreSQL Database)</li>
          <li>
            <a href="https://github.com/Keshwasya/musicbox" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              GitHub Repository
            </a>
          </li>        
        </ul>
        {/*<h3>Test Login:</h3>
        <p><strong>Email:</strong> test@test<br />
        <strong>Password:</strong> test</p>*/}
        <h3>Testing</h3>
        <p>Feel free to register a account, you can use any fake email</p>
        <p>You can search albums and artists to add to your current rotation or backlog to listen later </p>
        <p>You can click on your profile, after logging in to see your profile page</p>
        <p>leaving reviews route to be added</p>
      </div>
      
      <div className="container my-5">
        <h2 className="mt-5">Trending Artists</h2>
        <div className="scroll-container">
          {trendingArtists.map(artist => (
            <button
              key={artist.id}
              onClick={openSpotifyLink(`spotify:artist:${artist.id}`, `https://open.spotify.com/artist/${artist.id}`)}
              className="card artist-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {artist.images && artist.images[0] ? (
                <img src={artist.images[0].url} className="card-img-top" alt={artist.name} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{artist.name}</h5>
              </div>
            </button>
          ))}
        </div>

        {/*<h2 className="mt-5">Trending Albums</h2>
        <div className="scroll-container">
          {trendingAlbums.map(({ album, imageUrl }) => (
            <button
              key={album.id}
              //onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
              onClick={() => handleAlbumClick(album)}
              className="card album-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {imageUrl ? (
                <img src={imageUrl} className="card-img-top" alt={album.name} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{album.name}</h5>
                <p className="card-text">By {album.artists[0].name}</p>
              </div>
            </button>
          ))}
        </div>*/}

        <h2 className="mt-5">New Album Releases</h2>
        <div className="scroll-container">
          {newAlbumReleases.map(album => (
            <button
              key={album.id}
              //onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
              onClick={() => handleAlbumClick(album)}
              className="card album-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {album.images && album.images[0] ? (
                <img src={album.images[0].url} className="card-img-top" alt={album.name} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{album.name}</h5>
                <p className="card-text">By {album.artists[0].name}</p>
              </div>
            </button>
          ))}
        </div>

        <h2 className="mt-5">1001 Albums You Must Hear Before You Die</h2>
        <div className="scroll-container">
          {recommendedAlbums.map(album => (
            <button
              key={album.id}
              onClick={openSpotifyLink(album.spotifyUri, album.spotifyLink)}
              className="card album-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {album.cover ? (
                <img src={album.cover} className="card-img-top" alt={album.album} />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{album.album}</h5>
                <p className="card-text">By {album.artist}</p>
                <p className="card-text">Released: {album.year || 'Unknown'}</p>
              </div>
            </button>
          ))}
        </div>
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

                <button className="btn btn-primary w-100 mb-2" onClick={() => console.log(`Creating review for album: ${selectedAlbum.name}`)}>Create Review</button>

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
}

export default Homepage;
