import React, { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';
import { albums1001 } from '../data/albums1001';
import Navbar from './Navbar';
import AuthModal from './AuthModal';

function Homepage({ user, onLogin, onLogout }) {
  const [newAlbumReleases, setNewAlbumReleases] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);
  const [modalType, setModalType] = useState(null); // Track modal type (login/register)

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

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
          spotifyUri,
          spotifyLink,
        };
      }
    } catch (error) {
      console.error("Error fetching album details from Spotify:", error);
    }
    return album;
  };

  const fetchRandomRecommendations = useCallback(async () => {
    const priorityAlbumName = "Midnight Ride";
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
      {/* Navbar at the top */}
      <Navbar user={user} onLogin={openModal} onLogout={onLogout} />
      
      {/* Auth Modal */}
      {modalType && <AuthModal type={modalType} onClose={closeModal} onLogin={onLogin} />}

      {/* Banner content */}
      <div className="container text-center banner-container my-4">
        <h1 className="display-4">Welcome to Musicbox</h1>
        <p className="lead">By Keshwasya Singh</p>
        <hr className="my-2" />
        <h5>Tech Stack:</h5>
        <ul className="list-unstyled">
          <li>Frontend: React, Bootstrap</li>
          <li>Backend: Node.js, Express</li>
          <li>Authentication: Spotify API</li>
          <li>Deployment: Vercel (Frontend) and Render (Backend)</li>
        </ul>
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

        <h2 className="mt-5">Trending Albums</h2>
        <div className="scroll-container">
          {trendingAlbums.map(({ album, imageUrl }) => (
            <button
              key={album.id}
              onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
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
        </div>

        <h2 className="mt-5">New Album Releases</h2>
        <div className="scroll-container">
          {newAlbumReleases.map(album => (
            <button
              key={album.id}
              onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
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
    </div>
  );
}

export default Homepage;
