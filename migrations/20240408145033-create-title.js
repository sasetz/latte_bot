'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('titles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titleJp: {
        type: Sequelize.STRING
      },
      titleEn: {
        type: Sequelize.STRING
      },
      titleRu: {
        type: Sequelize.STRING
      },
      mangalibId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      siteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
      },
      roleId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      teamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('titles');
  }
};
