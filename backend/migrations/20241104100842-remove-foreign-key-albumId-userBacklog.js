'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserBacklog', 'UserBacklog_albumId_fkey');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('UserBacklog', {
      fields: ['albumId'],
      type: 'foreign key',
      name: 'UserBacklog_albumId_fkey',
      references: {
        table: 'Albums',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};

