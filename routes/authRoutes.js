// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const guestMiddleware = require('../middlewares/guestMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validations = require('../middlewares/validations');

// ========== RUTAS SOLO PARA INVITADOS (no logueados) ==========
router.get('/register', guestMiddleware, authController.registerForm);
router.post('/register', 
    guestMiddleware,
    upload.single('imagen_perfil'),
    validations.register,
    validations.handleErrors,
    authController.processRegister
);

router.get('/login', guestMiddleware, authController.login);
router.post('/login', 
    guestMiddleware,
    validations.login,
    validations.handleErrors,
    authController.processlogin
);

// ========== LOGOUT (para cualquiera) ==========
router.post('/logout', authController.logout);

module.exports = router;