const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');

const { Comanda, Mesa } = db;

const list = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await Comanda.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
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
  const comanda = await Comanda.findByPk(req.params.id);
  if (!comanda) {
    throw new AppError('Comanda no encontrada', 404);
  }
  res.json({ success: true, data: comanda });
});

const create = asyncHandler(async (req, res) => {
  const { mesaId, detalle, total, estado } = req.body;
  
  const mesaExists = await Mesa.findByPk(mesaId);
  if (!mesaExists) {
    throw new AppError('El ID de mesa ingresado no existe', 404);
  }

  const comanda = await Comanda.create({ 
    mesaId: parseInt(mesaId, 10), 
    detalle, 
    mesero: 'Caja', 
    total: parseFloat(total),
    estado: estado || 'En Preparación'
  });
  
  res.status(201).json({ success: true, data: comanda });
});

const replace = asyncHandler(async (req, res) => {
  const comanda = await Comanda.findByPk(req.params.id);
  if (!comanda) {
    throw new AppError('Comanda no encontrada', 404);
  }
  const { mesaId, detalle, total, estado } = req.body;
  await comanda.update({ mesaId: parseInt(mesaId, 10), detalle, total: parseFloat(total), estado });
  res.json({ success: true, data: comanda });
});

// rq-06: Lógica de secuencia validada
const patch = asyncHandler(async (req, res) => {
  const comanda = await Comanda.findByPk(req.params.id);
  if (!comanda) {
    throw new AppError('Comanda no encontrada', 404);
  }

  const { estado } = req.body;

  // Regla: No retroceder si ya está entregado
  if (comanda.estado === 'Entregado' && estado === 'En Preparación') {
    throw new AppError('Error: No se puede retroceder una comanda ya entregada.', 409);
  }

  await comanda.update({ estado: estado || comanda.estado });
  res.json({ success: true, data: comanda });
});

const remove = asyncHandler(async (req, res) => {
  const comanda = await Comanda.findByPk(req.params.id);
  if (!comanda) {
    throw new AppError('Comanda no encontrada', 404);
  }
  await comanda.destroy();
  res.status(204).send();
});

module.exports = { list, getById, create, replace, patch, remove };