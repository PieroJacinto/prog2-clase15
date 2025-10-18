const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController')
const guestMiddleware = require('../middlewares/guestMiddleware');

// rutas solo para invitados (no logueados)
router.get('/register', guestMiddleware, authController.registerForm );
router.post('/register', guestMiddleware, authController.processRegister);

router.get('/login',authController.login );
router.post('/login', authController.processlogin);

// ruta para logout (para cualquiera)
router.post('/logout',  authController.logout );

module.exports = router;