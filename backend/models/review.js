'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Review belongs to User
      Review.belongsTo(models.User, { foreignKey: 'userId' });
    
      // Review belongs to Album
      Review.belongsTo(models.Album, { foreignKey: 'albumId' });
    }
    
  }
  Review.init({
    userId: DataTypes.INTEGER,
    albumId: DataTypes.STRING,
    content: DataTypes.TEXT,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};