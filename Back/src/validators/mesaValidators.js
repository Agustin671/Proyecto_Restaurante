const { body, param, query } = require('express-validator');

const create = [
  body('numero').isInt({ min: 1 }).withMessage('El número de mesa debe ser un número entero válido'),
  body('capacidad').isInt({ min: 1 }).withMessage('La capacidad debe ser de al menos 1 persona'),
  body('ubicacion').trim().notEmpty().withMessage('La ubicación es obligatoria'),
  body('estado').optional().isIn(['Libre', 'Ocupada']).withMessage('El estado debe ser Libre u Ocupada'),
];

const update = [
  param('id').isInt({ min: 1 }).withMessage('ID de mesa inválido'),
  body('numero').optional().isInt({ min: 1 }),
  body('capacidad').optional().isInt({ min: 1 }),
  body('ubicacion').optional().trim().notEmpty(),
  body('estado').optional().isIn(['Libre', 'Ocupada']),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];

const listQuery = [
  query('estado').optional().isIn(['Libre', 'Ocupada']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { create, update, idParam, listQuery };