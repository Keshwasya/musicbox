'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    await queryInterface.addConstraint('UserRotation', {
      fields: ['albumId'],
      type: 'foreign key',
      name: 'UserRotation_albumId_fkey',
      references: {
        table: 'Albums',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('UserBacklog', 'UserBacklog_albumId_fkey');
    await queryInterface.removeConstraint('UserRotation', 'UserRotation_albumId_fkey');
  },
};
