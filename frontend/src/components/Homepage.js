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

  const fetchAlbumDetails = async (album) => {
    const token = await getAccessToken();
    try {
      // Primary search using both album and artist
      const query = `album:${encodeURIComponent(album.album)} artist:${encodeURIComponent(album.artist)}`;
      let response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=album&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      let data = await response.json();
    
      // Filter to match both album and artist exactly
      let spotifyAlbum = data.albums.items.find(
        (item) =>
          item.name.toLowerCase() === album.album.toLowerCase() &&
          item.artists.some((artist) => artist.name.toLowerCase() === album.artist.toLowerCase())
      );
    
      // Fallback search using only the album name if no result found
      if (!spotifyAlbum) {
        //console.log(`Album "${album.album}" by "${album.artist}" not found with full query. Trying album-only search.`);
        response = await fetch(
          `https://api.spotify.com/v1/search?q=album:${encodeURIComponent(album.album)}&type=album&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        data = await response.json();
  
        // Filter results to find the correct album by matching the artist name
        spotifyAlbum = data.albums.items.find(
          (item) =>
            item.artists.some((artist) => artist.name.toLowerCase() === album.artist.toLowerCase())
        );
      }
    
      if (spotifyAlbum) {
        const releaseDate = spotifyAlbum.release_date;
        const releaseYear = releaseDate ? releaseDate.split("-")[0] : null;
        const spotifyUri = `spotify:album:${spotifyAlbum.id}`; // Desktop app link
        const spotifyLink = spotifyAlbum.external_urls.spotify; // Browser link
  
        return {
          id: album.id,
          artist: album.artist,
          album: album.album,
          year: releaseYear,
          cover: spotifyAlbum.images[0]?.url,
          spotifyUri,
          spotifyLink,
        };
      } else {
        //console.log(`Album "${album.album}" by "${album.artist}" not found in Spotify search results.`);
      }
    } catch (error) {
      console.error("Error fetching album details from Spotify:", error);
    }
    return album;
  };
  
  
  
  
  
  
  

  // // Fetch random recommendations from the 1001 Albums list
  // const fetchRandomRecommendations = useCallback(async () => {
  //   const shuffledAlbums = albums1001.sort(() => 0.5 - Math.random()).slice(0, 20);
  //   const albumDetailsPromises = shuffledAlbums.map(album => fetchAlbumDetails(album));
  //   const albumsWithDetails = await Promise.all(albumDetailsPromises);
  //   setRecommendedAlbums(albumsWithDetails);
  // }, []);

  const fetchRandomRecommendations = useCallback(async () => {
    // Define the specific album name to include
    const priorityAlbumName = "Midnight Ride";
  
    // Find the album by name
    const priorityAlbum = albums1001.find(album => album.album === priorityAlbumName);
  
    // Shuffle the remaining albums and pick 19 other albums
    let shuffledAlbums = albums1001.filter(album => album.album !== priorityAlbumName).sort(() => 0.5 - Math.random()).slice(0, 19);
  
    // Add the priority album if it exists
    if (priorityAlbum) {
      shuffledAlbums = [priorityAlbum, ...shuffledAlbums];
    }
  
    const albumDetailsPromises = shuffledAlbums.map(album => fetchAlbumDetails(album));
    const albumsWithDetails = await Promise.all(albumDetailsPromises);
    setRecommendedAlbums(albumsWithDetails);
  }, []);


  const openSpotifyLink = (spotifyUri, webUrl) => (event) => {
    event.preventDefault();
  
    // Check if the platform is desktop
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
  
    if (isDesktop) {
      // Attempt to open the desktop app using window.open with a longer delay for the fallback
      const appWindow = window.open(spotifyUri, '_self');
  
      // Set a longer timeout for fallback to give the app time to open
      setTimeout(() => {
        if (document.hasFocus()) {
          // Only open the web link if the user is still on the same page, indicating the app didn’t open
          window.open(webUrl, '_blank');
        }
      }, 1500); // Extended delay to give the app time to open
    } else {
      // For mobile, open the web link directly
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
      <div className="container my-5">
  
        {/* Trending Artists Section */}
        <h2 className="mt-5">Trending Artists</h2>
        <div className="scroll-container">
          {trendingArtists.map(artist => (
            <button
              key={artist.id}
              onClick={openSpotifyLink(`spotify:artist:${artist.id}`, `https://open.spotify.com/artist/${artist.id}`)}
              className="card artist-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Card Content */}
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
              onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
              className="card album-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Card Content */}
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
              onClick={openSpotifyLink(`spotify:album:${album.id}`, `https://open.spotify.com/album/${album.id}`)}
              className="card album-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {/* Card Content */}
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
  
      {/* 1001 Albums Section */}
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
    );
  }
  
  export default Homepage;