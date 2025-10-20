const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Listar todos los usuarios
router.get('/', userController.index);

// Ver detalle de un usuario específico
router.get('/:id', userController.show);

// NOTA: Las rutas de create y store fueron eliminadas
// El registro de usuarios se hace en /auth/register

module.exports = router;