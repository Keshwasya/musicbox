'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'followers', 'followersData');
    await queryInterface.renameColumn('Users', 'backlog', 'backlogData');
    await queryInterface.renameColumn('Users', 'currentRotation', 'currentRotationData');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'followersData', 'followers');
    await queryInterface.renameColumn('Users', 'backlogData', 'backlog');
    await queryInterface.renameColumn('Users', 'currentRotationData', 'currentRotation');
  }
};
