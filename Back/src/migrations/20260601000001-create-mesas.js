'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mesas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ubicacion: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      // Nuevo campo en la base de datos física
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'Libre',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mesas');
  },
};