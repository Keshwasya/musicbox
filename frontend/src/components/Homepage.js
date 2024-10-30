import React, { useState, useEffect } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';

function Homepage() {
  const [newAlbumReleases, setNewAlbumReleases] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);

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

  // Fetch Trending Artists independently
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

  // Fetch Trending Albums via Curated Popular Playlists
  const fetchTrendingAlbums = async () => {
    const token = await getAccessToken();
    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
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

      // Extract unique albums
      const uniqueAlbums = [];
      allAlbums.forEach(({ album, imageUrl }) => {
        if (album && !uniqueAlbums.some(a => a.album.id === album.id)) {
          uniqueAlbums.push({ album, imageUrl });
        }
      });
      setTrendingAlbums(uniqueAlbums.slice(0, 20)); // Limit to 20 unique albums

    } catch (error) {
      console.error("Error fetching trending albums:", error);
    }
  };

  // Function to open Spotify links in app or web
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

  useEffect(() => {
    fetchNewAlbumReleases();
    fetchTrendingArtists();
    fetchTrendingAlbums();
  }, []);

  return (
    <div className="container my-5">
      {/* Trending Artists Section */}
      <h2 className="mt-5">Trending Artists</h2>
      <div className="scroll-container">
        {trendingArtists.map(artist => (
          <button
            key={artist.id}
            onClick={(e) => openSpotifyLink(`spotify:artist:${artist.id}`, `https://open.spotify.com/artist/${artist.id}`)(e)}
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

      {/* Trending Albums Section */}
      <h2 className="mt-5">Trending Albums</h2>
      <div className="scroll-container">
        {trendingAlbums.map(({ album, imageUrl }) => (
          <button
            key={album.id}
            onClick={(e) => openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)(e)}
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

        {/* New Album Releases Section */}
        <h2 className="mt-5">New Album Releases</h2>
      <div className="scroll-container">
        {newAlbumReleases.map(album => (
          <button
            key={album.id}
            onClick={(e) => openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)(e)}
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
    </div>
  );
}

export default Homepage;
