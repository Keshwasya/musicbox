'use strict';

/** @type {import('sequelize-cli').Migration} */
// migration file: change-albumId-to-string-in-reviews.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Reviews', 'albumId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Reviews', 'albumId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};

