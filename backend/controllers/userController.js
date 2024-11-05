const { User, Album, Review } = require('../models');

// Retrieve list of followers and following for a user
exports.getFollowersAndFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
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


// Retrieve user feed (activity from followed users)
exports.getUserFeed = async (req, res) => {
  const userId = req.user.id; // Assuming req.user.id is set by authMiddleware

  try {
    // Fetch the user with only the 'following' association specified by 'as'
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'following', attributes: ['id'] }] // Specify 'as' for the association
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followingIds = user.following.map(followedUser => followedUser.id);

    // Fetch recent activities for the users that the current user is following
    const feedActivities = await Review.findAll({
      where: { userId: followingIds },
      order: [['createdAt', 'DESC']],
      limit: 20, // Limit to recent 20 activities
    });

    res.status(200).json(feedActivities);
  } catch (error) {
    console.error('Error fetching user feed:', error); // Log error for debugging
    res.status(500).json({ error: 'Failed to retrieve user feed' });
  }
};






// Get user profile data
exports.getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [
        { association: 'Followers', attributes: ['id', 'username'] },
        { association: 'Following', attributes: ['id', 'username'] },
        { association: 'Backlog', attributes: ['id', 'title'] },
        { association: 'CurrentRotation', attributes: ['id', 'title'] },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

// Update user information (profile picture, bio, etc.)
exports.updateUser = async (req, res) => {
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
exports.followUser = async (req, res) => {
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
exports.unfollowUser = async (req, res) => {
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
