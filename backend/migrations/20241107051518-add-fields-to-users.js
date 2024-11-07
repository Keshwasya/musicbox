'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'followersData', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'backlogData', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'currentRotationData', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'profilePicture', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'followersData');
    await queryInterface.removeColumn('Users', 'backlogData');
    await queryInterface.removeColumn('Users', 'currentRotationData');
    await queryInterface.removeColumn('Users', 'profilePicture');
    await queryInterface.removeColumn('Users', 'bio');
  }
};
