'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Backlog Users: Many-to-many relationship with User
      Album.belongsToMany(models.User, {
        as: 'BacklogUsers',
        through: 'UserBacklog',
        foreignKey: 'albumId',
      });
    
      // Rotation Users: Many-to-many relationship with User
      Album.belongsToMany(models.User, {
        as: 'RotationUsers',
        through: 'UserRotation',
        foreignKey: 'albumId',
      });
    
      // Reviews: One-to-many relationship with Review
      Album.hasMany(models.Review, { foreignKey: 'albumId' });
    }
    
  }
  Album.init({
    spotifyId: DataTypes.STRING,
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    year: DataTypes.INTEGER,
    coverUrl: DataTypes.STRING,
    genre: DataTypes.STRING,
    releaseDate: DataTypes.DATE,
    spotifyLink: DataTypes.STRING,
    popularity: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};