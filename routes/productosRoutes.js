const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const productoController = require('../controllers/ProductoController');
const validations = require('../middlewares/validations')
const authMiddleware = require('../middlewares/authMiddleware'); // ⬅️ NUEVO
// 1- lista DE PRODUCTOS
router.get('/', productoController.index);
//2 - formulario de creacion
router.get('/create', authMiddleware, productoController.create); // ⬅️ Protegida
// 3 procesar la creacion del producto
router.post('/create', 
    upload.array('imagenes_producto', 5),
    validations.producto,
    validations.handleErrors,
    productoController.store )

router.get('/:id/edit/', authMiddleware, productoController.edit); // ⬅️ Protegida
router.put('/:id', authMiddleware, productoController.update); // ⬅️ Protegida
router.delete('/:id', authMiddleware, productoController.destroy); // ⬅️ Protegida
// ver detalle ( al final, porque es las mas generica)
router.get('/:id', productoController.show )



module.exports = router;

/*
Las rutas con authMiddleware solo son accesibles para usuarios logueados
Si intentan acceder sin login → redirige a /auth/login
Las rutas públicas (listar, ver detalle) NO tienen middleware
*/