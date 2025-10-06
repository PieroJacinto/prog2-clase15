const {body, validationResult } = require("express-validator");
const { Usuario, Producto, Categoria } = require('../database/models');
const fs = require('fs');
const path = require('path'); //AGREGAR
const validations = {
    // VALIDACIONES PARA LA CREACION DE USUARIOS

    usuario: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ min:2 ,max: 100})
            .withMessage('El nombre debe tener entre 2 y 100 caracteres') //agrrego
            .trim(),
        body('email')
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('Debe ser un email valido')
            .normalizeEmail()// conviuerte a minusculas y lo normaliza
            .custom( async (email) => {
                // VALIDACION CUSTOM: email debe ser unico
                const existeUsuario = await Usuario.findOne({ where: {email}});
                if(existeUsuario){
                    throw new Error("Este mail ya esta registrado")
                }
                return true;
            }),
        // VALIDACIÓN DE IMAGEN
        body('imagen_usuario')
            .custom((value, { req }) => {
                // Si no hay archivo subido
                if (!req.file) {
                    throw new Error('Debes subir una imagen de perfil');
                }
                
                // Validar extensiones permitidas
                const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
                const extension = path.extname(req.file.originalname).toLowerCase();
                
                if (!extensionesPermitidas.includes(extension)) {
                    throw new Error(
                        `Las extensiones permitidas son: ${extensionesPermitidas.join(', ')}`
                    );
                }
                
                return true;
            })
    ],
    producto: [
        // Validación del nombre del producto
        body('nombre')
            .notEmpty()
            .withMessage('El nombre del producto es obligatorio')
            .isLength({ min: 3, max: 100 })
            .withMessage('El nombre debe tener entre 3 y 100 caracteres')
            .trim(),
        
        // Validación del precio
        body('precio')
            .notEmpty()
            .withMessage('El precio es obligatorio')
            .isFloat({ min: 0.01 })
            .withMessage('El precio debe ser un número mayor a 0')
            .custom((value) => {
                // Validar que tenga máximo 2 decimales
                const regex = /^\d+(\.\d{1,2})?$/;
                if (!regex.test(value)) {
                    throw new Error('El precio puede tener máximo 2 decimales');
                }
                return true;
            }),
        
        // Validación de la descripción
        body('descripcion')
            .notEmpty()
            .withMessage('La descripción es obligatoria')
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres')
            .trim(),
        
        // Validación del usuario_id (dueño)
        body('usuario_id')
            .notEmpty()
            .withMessage('Debes seleccionar un dueño para el producto')
            .isInt()
            .withMessage('El dueño debe ser válido')
            .custom(async (value) => {
                // Verificar que el usuario existe
                const usuario = await Usuario.findByPk(value);
                if (!usuario) {
                    throw new Error('El usuario seleccionado no existe');
                }
                return true;
            }),
        
        // Validación de categorías (opcional pero si hay, debe ser array)
        body('categorias')
            .optional()
            .custom((value) => {
                // Si se envió categorías, debe ser un array
                if (!Array.isArray(value)) {
                    // Si es un solo valor, lo convertimos a array
                    return true;
                }
                return true;
            }),
        
        // VALIDACIÓN DE IMÁGENES - La más importante
        body('imagenes_producto')
            .custom((value, { req }) => {
                // Verificar que se subieron archivos
                if (!req.files || req.files.length === 0) {
                    throw new Error('Debes subir al menos una imagen del producto');
                }
                
                // Verificar cantidad máxima
                if (req.files.length > 5) {
                    throw new Error('Puedes subir máximo 5 imágenes');
                }
                
                // Validar extensiones permitidas
                const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
                
                req.files.forEach((file, index) => {
                    const extension = path.extname(file.originalname).toLowerCase();
                    
                    if (!extensionesPermitidas.includes(extension)) {
                        throw new Error(
                            `Imagen ${index + 1}: Las extensiones permitidas son: ${extensionesPermitidas.join(', ')}`
                        );
                    }
                    
                    // Validar tamaño (5MB máximo por imagen)
                    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
                    if (file.size > maxSize) {
                        throw new Error(
                            `Imagen ${index + 1}: El tamaño máximo es 5MB`
                        );
                    }
                });
                
                return true;
            })
    ],

    // middleware para manejar errores de validacion
    /*handleErrors: (req, res,  next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next();
        }
        console.log("errores de validacion encontrados: ", errors.array());

        //IMPORTANTE: SI hay archivos y errores, eliminar los archivos
        if(req.file){
            fs.unlink(req.file.path, () => {})
        }
        if(req.files){
            req.files.forEach(file => {
                fs.unlink(file.path, () => {})
            });
        }

        // Renderizar formulario con errores NUEVO
        return res.render('usuarios/create', {
            errors: errors.array(),  // Array simple de errores
            oldData: req.body,       // Datos que escribió el usuario
            title: 'Crear Usuario',
            h1: 'Nuevo Usuario'
        });        
        
        // si no hay errores, continuar
        next();
    },*/

    // MIDDLEWARE PARA MANEJAR ERRORES    
    handleErrors: async (req, res, next) => {
    const errors = validationResult(req);
    
    // Early return - Si NO hay errores, continuar
    if (errors.isEmpty()) {
        return next();
    }
    
    // Si llegamos aquí, HAY errores
    console.log("❌ Errores de validación encontrados:", errors.array());
    console.log("📍 URL detectada:", req.originalUrl); // Para debugging
    
    // Limpieza de archivos
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.log('Error eliminando archivo:', err);
        });
    }
    
    if (req.files) {
        req.files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.log('Error eliminando archivo:', file.filename);
            });
        });
    }
    
    // ✅ CORRECCIÓN: Usar originalUrl en lugar de path
    const isProducto = req.originalUrl.includes('producto');
    
    if (isProducto) {
        try {
            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();
            
            console.log("✅ Usuarios cargados:", usuarios.length);
            console.log("✅ Categorías cargadas:", categorias.length);
            
            return res.render('productos/create', {
                errors: errors.array(),
                oldData: req.body,
                title: 'Crear Producto',
                h1: 'Nuevo Producto',
                usuarios: usuarios,
                categorias: categorias
            });
            
        } catch (err) {
            console.log('❌ Error cargando datos:', err);
            return res.redirect('/productos/create');
        }
    }
    
    // Para usuarios
    return res.render('usuarios/create', {
        errors: errors.array(),
        oldData: req.body,
        title: 'Crear Usuario',
        h1: 'Nuevo Usuario'
    });
}

}

module.exports = validations;