'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UserBacklog_albumId_fkey'
        ) THEN
          ALTER TABLE "UserBacklog" DROP CONSTRAINT "UserBacklog_albumId_fkey";
        END IF;
      END$$;
    `);
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

