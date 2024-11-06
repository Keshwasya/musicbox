const { User, Album, Review } = require('../models');
const { Op } = require('sequelize');

// Retrieve list of followers and following for a user
const getFollowersAndFollowing = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'followers', attributes: ['id', 'username'] },
        { model: User, as: 'following', attributes: ['id', 'username'] },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve followers and following' });
  }
};


// Get recent reviews from followed users
const getUserFeed = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      include: [{ model: User, as: 'following', attributes: ['id'] }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followingIds = user.following.map(followedUser => followedUser.id);
    const feedActivities = await Review.findAll({
      where: { userId: followingIds },
      include: { model: Album, attributes: ['title', 'artist'] },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    res.json(feedActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user feed' });
  }
};


// Get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching user profile for user ID: ${id}`);

    // Find the user with associated followers and following data
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'profilePicture', 'bio'],
      include: [
        { association: 'followers', attributes: ['id', 'username'] },
        { association: 'following', attributes: ['id', 'username'] }
      ]
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};


// Update user information (profile picture, bio, etc.)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { profilePicture, bio } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ profilePicture, bio });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user information' });
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { id } = req.params;
  const followerId = req.user.id;

  if (parseInt(id) === followerId) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }

  try {
    const userToFollow = await User.findByPk(id);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userToFollow.addFollower(followerId);
    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const followerId = req.user.id;

  try {
    const userToUnfollow = await User.findByPk(id);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userToUnfollow.removeFollower(followerId);
    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

module.exports = {
  getUserProfile,
  updateUser,
  followUser,
  unfollowUser,
  getUserFeed,
  getFollowersAndFollowing,
};
