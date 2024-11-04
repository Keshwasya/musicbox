const { User, Album } = require('../models');
const { getAlbumData } = require('../services/spotifyService'); // Spotify service for API requests

// Add album to backlog with data from Spotify
const addToBacklog = async (req, res) => {
  const { userId } = req.params;
  const { spotifyAlbumId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let album = await Album.findOne({ where: { spotifyId: spotifyAlbumId } });
    if (!album) {
      const albumData = await getAlbumData(spotifyAlbumId);
      album = await Album.create({
        spotifyId: albumData.id,
        title: albumData.name,
        artist: albumData.artists[0].name,
        year: new Date(albumData.release_date).getFullYear(),
        coverUrl: albumData.images[0].url,
        genre: albumData.genres.join(', '),
        releaseDate: albumData.release_date,
        spotifyLink: albumData.external_urls.spotify,
        popularity: albumData.popularity,
      });
    }

    await user.addBacklog(album);
    res.status(200).json({ message: 'Album added to backlog', album });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add album to backlog' });
  }
};

// Remove album from backlog
const removeFromBacklog = async (req, res) => {
  const { userId, albumId } = req.params;

  try {
    const user = await User.findByPk(userId);
    const album = await Album.findByPk(albumId);

    if (!user || !album) return res.status(404).json({ error: 'User or Album not found' });

    await user.removeBacklog(album);
    res.status(200).json({ message: 'Album removed from backlog' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove album from backlog' });
  }
};

// Add album to current rotation with data from Spotify
const addToCurrentRotation = async (req, res) => {
  const { userId } = req.params;
  const { spotifyAlbumId } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let album = await Album.findOne({ where: { spotifyId: spotifyAlbumId } });
    if (!album) {
      const albumData = await getAlbumData(spotifyAlbumId);
      album = await Album.create({
        spotifyId: albumData.id,
        title: albumData.name,
        artist: albumData.artists[0].name,
        year: new Date(albumData.release_date).getFullYear(),
        coverUrl: albumData.images[0].url,
        genre: albumData.genres.join(', '),
        releaseDate: albumData.release_date,
        spotifyLink: albumData.external_urls.spotify,
        popularity: albumData.popularity,
      });
    }

    await user.addCurrentRotation(album);
    res.status(200).json({ message: 'Album added to current rotation', album });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add album to current rotation' });
  }
};

// Remove album from current rotation
const removeFromCurrentRotation = async (req, res) => {
  const { userId, albumId } = req.params;

  try {
    const user = await User.findByPk(userId);
    const album = await Album.findByPk(albumId);

    if (!user || !album) return res.status(404).json({ error: 'User or Album not found' });

    await user.removeCurrentRotation(album);
    res.status(200).json({ message: 'Album removed from current rotation' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove album from current rotation' });
  }
};

module.exports = {
  addToBacklog,
  removeFromBacklog,
  addToCurrentRotation,
  removeFromCurrentRotation,
};
