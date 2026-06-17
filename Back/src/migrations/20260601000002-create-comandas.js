'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comandas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mesaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // AGREGAMOS EL CAMPO A LA BASE DE DATOS FÍSICA
      detalle: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mesero: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable('comandas');
  },
};