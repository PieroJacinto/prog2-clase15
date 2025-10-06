const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const productoController = require('../controllers/ProductoController');
const validations = require('../middlewares/validations'); // ⬅️ AGREGAR
// 1- lista DE PRODUCTOS
router.get('/', productoController.index);
//2 - formulario de creacion
router.get('/create', productoController.create )
// 3 procesar la creacion del producto
router.post('/create', 
    upload.array('imagenes_producto', 5),  // Primero procesa las imágenes
    validations.producto,                   // Luego valida los datos
    validations.handleErrors,               // Finalmente maneja los errores
    productoController.store                // Si todo OK, ejecuta el controller
);

router.get('/:id/edit/', productoController.edit)

router.put('/:id', productoController.update )

router.delete('/:id', productoController.destroy)
// ver detalle ( al final, porque es las mas generica)
router.get('/:id', productoController.show )



module.exports = router;