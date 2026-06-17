'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comanda = sequelize.define(
    'Comanda',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mesaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      detalle: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mesero: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // Este es el campo nuevo para cumplir con el GEN-12 (Evolución de esquema)
      notas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'comandas',
    }
  );

  Comanda.associate = (models) => {
    Comanda.belongsTo(models.Mesa, {
      foreignKey: 'mesaId',
      as: 'mesa',
    });
  };

  return Comanda;
};