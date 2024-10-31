import React, { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '../utils/spotifyAuth';
import { albums1001 } from '../data/albums1001'; // static data file


function Homepage() {
  const [newAlbumReleases, setNewAlbumReleases] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingAlbums, setTrendingAlbums] = useState([]);
  const [recommendedAlbums, setRecommendedAlbums] = useState([]);

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

  // Fetch album details from Spotify for the "1001 Albums" section
  const fetchAlbumDetails = async (album) => {
    const token = await getAccessToken();
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=album:${encodeURIComponent(album.album)}%20artist:${encodeURIComponent(album.artist)}&type=album&limit=1`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        if (data.albums.items.length > 0) {
            const spotifyAlbum = data.albums.items[0];
            const releaseDate = spotifyAlbum.release_date;
            const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;
            return {
                id: album.id,
                artist: album.artist,
                album: album.album,
                year: releaseYear, // Use Spotify-provided release year
                cover: spotifyAlbum.images[0]?.url,
                spotifyLink: spotifyAlbum.external_urls.spotify
            };
        }
    } catch (error) {
        console.error("Error fetching album cover from Spotify:", error);
    }
    return album; // Return original album data if Spotify cover isn't found
  };


// // Fetch random recommendations with `useCallback`
// const fetchRandomRecommendations = useCallback(async () => {
//   const shuffledAlbums = albums1001.sort(() => 0.5 - Math.random()).slice(0, 20);
//   const albumDetailsPromises = shuffledAlbums.map(album => fetchAlbumDetails(album));
//   const albumsWithDetails = await Promise.all(albumDetailsPromises);
//   setRecommendedAlbums(albumsWithDetails);
// }, []);

  const fetchRandomRecommendations = useCallback(async (priorityAlbumName = null) => {
    // Shuffle and select 20 random albums
    let shuffledAlbums = albums1001.sort(() => 0.5 - Math.random()).slice(0, 20);
    
    // Check if priorityAlbumName is specified and present in the random selection
    if (priorityAlbumName) {
        const priorityAlbum = albums1001.find(album => album.album.toLowerCase() === priorityAlbumName.toLowerCase());
        
        // If the priority album exists and is not in the shuffled list, add it
        if (priorityAlbum && !shuffledAlbums.some(album => album.id === priorityAlbum.id)) {
            shuffledAlbums[0] = priorityAlbum; // Replace the first item to ensure inclusion
        }
    }
    
    // Fetch details for each album in the list
    const albumDetailsPromises = shuffledAlbums.map(album => fetchAlbumDetails(album));
    const albumsWithDetails = await Promise.all(albumDetailsPromises);
    setRecommendedAlbums(albumsWithDetails);
  }, []);


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
    fetchRandomRecommendations("Black Sabbath (2014 Remaster)");
  }, [fetchRandomRecommendations]);


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

      <h2 className="mt-5">1001 Albums You Must Hear Before You Die</h2>
      <div className="scroll-container">
          {recommendedAlbums.map(album => (
              <button
                  key={album.id}
                  onClick={() => window.open(album.spotifyLink, '_blank')}
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
                      <p className="card-text">Released: {album.year}</p>
                  </div>
              </button>
          ))}
      </div>
    </div>
  );
}

export default Homepage;
