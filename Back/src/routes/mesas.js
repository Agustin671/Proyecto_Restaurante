const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const { verifyAccessToken } = require('../middlewares/auth');

// GEN-06: Protegemos absolutamente todas las rutas de las mesas
router.use(verifyAccessToken);

// Nueva ruta para el rq-10: Cierre de cuenta
// DEBE IR ANTES DE LA RUTA DE /:id OBLIGATORIAMENTE
router.post('/:id/close', mesaController.closeAccount);

// Rutas base: /mesas
router.route('/')
  .get(mesaController.getAll)     // rq-08: Listar
  .post(mesaController.create);   // rq-03: Crear

// Rutas con ID: /mesas/:id
router.route('/:id')
  .get(mesaController.getById)    // rq-03: Leer una
  .put(mesaController.update)     // rq-03: Actualizar
  .patch(mesaController.update)   // rq-03: Actualizar parcial
  .delete(mesaController.remove); // rq-03: Eliminar

module.exports = router;