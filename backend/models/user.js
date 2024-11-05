'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Followers: Self-referential many-to-many relationship
      User.belongsToMany(models.User, {
        as: 'followers',
        through: 'UserFollowers',
        foreignKey: 'userId',
        otherKey: 'followerId',
      });
    
      // Following: Self-referential many-to-many relationship (optional)
      User.belongsToMany(models.User, {
        as: 'following',
        through: 'UserFollowers',
        foreignKey: 'followerId',
        otherKey: 'userId',
      });
    
      // Backlog: Many-to-many relationship with Album
      User.belongsToMany(models.Album, {
        as: 'Backlog',
        through: 'UserBacklog',
        foreignKey: 'userId',
      });
    
      // Current Rotation: Many-to-many relationship with Album
      User.belongsToMany(models.Album, {
        as: 'CurrentRotation',
        through: 'UserRotation',
        foreignKey: 'userId',
      });
    
      // Reviews: One-to-many relationship with Review
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }
    
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    followersData: DataTypes.JSON, // Renamed to avoid conflict
    backlogData: DataTypes.JSON, // Renamed to avoid conflict
    currentRotationData: DataTypes.JSON, // Renamed to avoid conflict
    profilePicture: DataTypes.STRING,
    bio: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};