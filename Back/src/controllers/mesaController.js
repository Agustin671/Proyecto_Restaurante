const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');

const { Mesa, Comanda } = db;

const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const where = {};
  if (req.query.search) {
    where.ubicacion = { [Op.like]: `%${req.query.search}%` };
  }
  if (req.query.estado) {
    where.estado = req.query.estado;
  }

  const { count, rows } = await Mesa.findAndCountAll({
    where,
    limit,
    offset,
    order: [['numero', 'ASC']],
  });

  res.json({
    success: true,
    data: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  });
});

const getById = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) {
    throw new AppError('Mesa no encontrada', 404);
  }
  res.json({ success: true, data: mesa });
});

const create = asyncHandler(async (req, res) => {
  const { numero, capacidad, ubicacion, estado } = req.body;
  
  const mesaExists = await Mesa.findOne({ where: { numero: parseInt(numero, 10) } });
  if (mesaExists) {
    throw new AppError('El número de mesa ya está registrado', 409);
  }

  const mesa = await Mesa.create({ 
    numero: parseInt(numero, 10), 
    capacidad: parseInt(capacidad, 10), 
    ubicacion,
    estado: estado || 'Libre'
  });
  
  res.status(201).json({ success: true, data: mesa });
});

const update = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) {
    throw new AppError('Mesa no encontrada', 404);
  }

  const { numero, capacidad, ubicacion, estado } = req.body;
  
  if (numero && parseInt(numero, 10) !== mesa.numero) {
    const mesaExists = await Mesa.findOne({ where: { numero: parseInt(numero, 10) } });
    if (mesaExists) {
      throw new AppError('El número de mesa ya está registrado', 409);
    }
  }

  if (estado === 'Libre' && mesa.estado !== 'Libre') {
    const comandasAbiertas = await Comanda.count({
      where: {
        mesaId: mesa.id,
        estado: { [Op.ne]: 'Entregado' }
      }
    });

    if (comandasAbiertas > 0) {
      throw new AppError('No se puede liberar la mesa: Aún tiene comandas sin entregar.', 409);
    }
  }

  await mesa.update({ 
    numero: numero ? parseInt(numero, 10) : mesa.numero, 
    capacidad: capacidad ? parseInt(capacidad, 10) : mesa.capacidad, 
    ubicacion: ubicacion || mesa.ubicacion,
    estado: estado || mesa.estado
  });
  
  res.json({ success: true, data: mesa });
});

const closeAccount = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id, {
    include: [{ model: Comanda, as: 'comandas' }]
  });

  if (!mesa) throw new AppError('Mesa no encontrada', 404);

  const tienePendientes = mesa.comandas.some(c => c.estado !== 'Entregado');
  if (tienePendientes) {
    throw new AppError('No se puede cerrar: hay pedidos sin entregar', 409);
  }

  const totalCuenta = mesa.comandas.reduce((sum, c) => sum + parseFloat(c.total), 0);
  const totalConPropina = totalCuenta * 1.10;

  await mesa.update({ estado: 'Libre' });

  res.json({ 
    success: true, 
    data: { total: totalCuenta.toFixed(0), totalConPropina: totalConPropina.toFixed(0) } 
  });
});

const remove = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) {
    throw new AppError('Mesa no encontrada', 404);
  }
  await mesa.destroy();
  res.status(204).send();
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  closeAccount
};