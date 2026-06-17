'use strict';

module.exports = (sequelize, DataTypes) => {
  const Mesa = sequelize.define(
    'Mesa',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ubicacion: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      // Nuevo campo para rq-05 y rq-07
      estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Libre', 
      },
    },
    {
      tableName: 'mesas',
    }
  );

  Mesa.associate = (models) => {
    Mesa.hasMany(models.Comanda, {
      foreignKey: 'mesaId',
      as: 'comandas',
    });
  };

  return Mesa;
};