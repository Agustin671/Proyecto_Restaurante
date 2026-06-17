const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const mesasRoutes = require('./mesas');
const comandasRoutes = require('./comandas'); // 1. Importar comandas

router.use('/auth', authRoutes);
router.use('/mesas', mesasRoutes);
router.use('/comandas', comandasRoutes); // 2. Registrar la ruta /comandas

module.exports = router;