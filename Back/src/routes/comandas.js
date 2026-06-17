const express = require('express');
const router = express.Router();
const comandaController = require('../controllers/comandaController');
const { verifyAccessToken } = require('../middlewares/auth');

// GEN-06: Protegemos absolutamente todas las rutas de las comandas
router.use(verifyAccessToken);

// Rutas base: /comandas
router.route('/')
  .get(comandaController.list)      // Listar comandas
  .post(comandaController.create);  // Crear comanda

// Rutas con ID: /comandas/:id
router.route('/:id')
  .get(comandaController.getById)   // Leer una
  .put(comandaController.replace)   // Actualizar
  .patch(comandaController.patch)   // Actualizar parcial
  .delete(comandaController.remove);// Eliminar

module.exports = router;