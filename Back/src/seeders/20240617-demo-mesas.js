'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    
    // Usamos números altos (101, 102, 103) para evitar el error 'unique' con mesas existentes
    await queryInterface.bulkInsert('mesas', [
      { numero: 101, capacidad: 2, ubicacion: 'Interior', estado: 'Libre', createdAt: now, updatedAt: now },
      { numero: 102, capacidad: 4, ubicacion: 'Terraza', estado: 'Libre', createdAt: now, updatedAt: now },
      { numero: 103, capacidad: 6, ubicacion: 'Ventana', estado: 'Ocupada', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('mesas', null, {});
  },
};