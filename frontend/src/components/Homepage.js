import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';

function Homepage() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const fetchPopularAlbums = async () => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAlbums(data.albums.items);
    } catch (error) {
      console.error("Error fetching popular albums:", error);
    }
  };

  const fetchTopArtistsByGenre = async (genre) => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=genre:${genre}&type=artist&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setArtists(data.artists.items);
    } catch (error) {
      console.error("Error fetching top artists:", error);
    }
  };

  useEffect(() => {
    fetchPopularAlbums();
    fetchTopArtistsByGenre("pop");
  }, []);

  const openSpotifyLink = (spotifyUri, webUrl) => (event) => {
    event.preventDefault();
    let appOpened = false;
  
    // Attempt to open the Spotify app using an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = spotifyUri;
    document.body.appendChild(iframe);
  
    // Set the appOpened flag to true after a short delay if the app is launched successfully
    setTimeout(() => {
      appOpened = true;
      document.body.removeChild(iframe);
    }, 1000);
  
    // Fallback to the web URL if the app hasn't opened
    setTimeout(() => {
      if (!appOpened) {
        window.open(webUrl, '_blank');
      }
    }, 1500); // Slightly longer delay for the web fallback
  };
  
  

  return (
    <div className="container my-5">

      {/* Top Artists Section */}
      <h2 className="mt-5">Top 10 Pop Artists</h2>
      <div className="scroll-container">
        {artists.map(artist => (
          <button
            key={artist.id}
            href="#"
            onClick={openSpotifyLink(`spotify:artist:${artist.id}`, `https://open.spotify.com/artist/${artist.id}`)}
            className="card artist-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src={artist.images[0]?.url} className="card-img-top" alt={artist.name} />
            <div className="card-body">
              <h5 className="card-title">{artist.name}</h5>
            </div>
          </button>
        ))}
      </div>

      {/* Top Albums Section */}
      <h2 className="mt-5">Top 10 Pop Albums</h2>
      <div className="scroll-container">
        {albums.map(album => (
          <button
            key={album.id}
            href="#"
            onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
            className="card album-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <img src={album.images[0]?.url} className="card-img-top" alt={album.name} />
            <div className="card-body">
              <h5 className="card-title">{album.name}</h5>
              <p className="card-text">By {album.artists[0].name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
