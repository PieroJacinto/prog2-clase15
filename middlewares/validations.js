const {body, validationResult } = require("express-validator");
const { Usuario, Producto , Categoria} = require('../database/models');
const fs = require('fs');
const path = require("path");

const validations = {
    // ========== VALIDACIONES PARA AUTENTICACIÓN ==========
    
    // REGISTRO - Creación de cuenta nueva
    register: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres')
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            .withMessage('El nombre solo puede contener letras')
            .trim(),
        
        body('email')
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('Debe ser un email válido')
            .normalizeEmail()
            .custom(async (email) => {
                const usuarioExistente = await Usuario.findOne({ 
                    where: { email } 
                });
                if (usuarioExistente) {
                    throw new Error('El email ya está registrado');
                }
                return true;
            }),
        
        body('password')
            .notEmpty()
            .withMessage('La contraseña es obligatoria')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
        
        body('password_confirmation')
            .notEmpty()
            .withMessage('Debes confirmar la contraseña')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Las contraseñas no coinciden');
                }
                return true;
            }),
        
        body('imagen_perfil')
            .optional()
            .custom((value, { req }) => {
                if (!req.file) {
                    return true; // La imagen es opcional
                }
                
                const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.gif'];
                const extension = path.extname(req.file.originalname).toLowerCase();
                
                if (!extensionesPermitidas.includes(extension)) {
                    throw new Error(
                        `Solo se permiten imágenes: ${extensionesPermitidas.join(', ')}`
                    );
                }
                
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (req.file.size > maxSize) {
                    throw new Error('La imagen no puede superar los 5MB');
                }
                
                return true;
            })
    ],

    // LOGIN - Verificación de credenciales
    login: [
        body('email')
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('Debe ser un email válido')
            .normalizeEmail()
            .custom(async (email, { req }) => {
                const bcrypt = require('bcryptjs');
                const usuario = await Usuario.findOne({ 
                    where: { email } 
                });
                
                if (!usuario) {
                    throw new Error('Credenciales inválidas');
                }
                
                // Guardar el usuario en req para usarlo después
                req.usuarioEncontrado = usuario;
                return true;
            }),
        
        body('password')
            .notEmpty()
            .withMessage('La contraseña es obligatoria')
            .custom((password, { req }) => {
                const bcrypt = require('bcryptjs');
                
                // Verificar que tenemos el usuario del paso anterior
                if (!req.usuarioEncontrado) {
                    throw new Error('Credenciales inválidas');
                }
                
                // Comparar el password
                const passwordCorrecta = bcrypt.compareSync(
                    password, 
                    req.usuarioEncontrado.password
                );
                
                if (!passwordCorrecta) {
                    throw new Error('Credenciales inválidas');
                }
                
                return true;
            })
    ],

    // ========== VALIDACIONES PARA PRODUCTOS ==========
    producto: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre del producto es obligatorio')
            .isLength({ min:4 ,max: 100})
            .withMessage('El nombre debe tener entre 4 y 100 caracteres')
            .trim(),
        body('precio')
            .notEmpty()
            .withMessage('El precio es obligatorio')
            .isFloat({min: 0.01})
            .withMessage('El precio debe ser un numero mayor a 0') ,
        body('descripcion')          
            .notEmpty()
            .withMessage('La descripcion del producto es obligatoria')
            .isLength({ min:10 ,max: 500})
            .withMessage('La descripciondebe tener entre 10 y 500 caracteres')
            .trim(),
        body('usuario_id')
            .notEmpty()
            .withMessage('Debes seleccionar un dueño para el producto')
            .isInt()
            .withMessage("'El dueño debe ser valido")
            .custom(async (value) => {
                const usuario = await Usuario.findByPk(value)
                if(!usuario){
                    throw new Error('El usuario seleccionado no existe')
                }
                return true;
            }),
        body('imagenes_producto')
            .custom( (value, {req}) => {
                if(!req.files || req.files.length === 0) {
                    throw new Error("Debes subir al menos una imagen del producto")
                }
                if(req.files.length > 5){
                     throw new Error("Puedes subir maximo 5 imagenes del producto")
                }
                const extensionesPermitidas = [ ".jpg", ".jpeg", ".png", ".gif"];
                req.files.forEach((file, index) => {
                    const extension = path.extname(file.originalname).toLowerCase();

                    if(!extensionesPermitidas.includes(extension)){
                        throw new Error(
                            `Imagen ${index + 1}: Las extensiones permitidas son: ${extensionesPermitidas.join(', ')}`
                        )
                    }

                    const maxSize = 5 * 1024 * 1024; // 5mb
                    if( file.size > maxSize){
                        throw new Error(
                            `Imagen ${index + 1}: El tamaño maximo es de 5mb`)
                    }
                });
                return true;
            })
    ],

    // ========== MIDDLEWARE PARA MANEJAR ERRORES ==========
    handleErrors: async (req, res, next) => {
        // Obtener el resultado de las validaciones ejecutadas previamente
        const errors = validationResult(req);
        
        // Si no hay errores, continuar con el siguiente middleware/controller
        if(errors.isEmpty()){
            return next();
        }

        // Mostrar en consola los errores encontrados (útil para debugging)
        console.log("Errores de validación encontrados: ", errors.array());        

        // ========== LIMPIEZA DE ARCHIVOS SUBIDOS ==========
        // IMPORTANTE: Si hay errores de validación y se subieron archivos,
        // debemos eliminarlos del servidor para no acumular archivos basura
        
        // Si se subió UN archivo (req.file - multer single)
        if(req.file){
            fs.unlink(req.file.path, (err) => {
                if(err) console.log("Error eliminando archivo:", err);
            })
        }
        
        // Si se subieron MÚLTIPLES archivos (req.files - multer array)
        if(req.files){
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if(err) console.log("Error eliminando archivo:", err);
                })
            });
        }

        // ========== DETECTAR QUÉ FORMULARIO RENDERIZAR ==========
        // Analizamos la URL para saber a qué vista devolver al usuario
        const isProducto = req.originalUrl.includes('producto');
        const isRegister = req.originalUrl.includes('register');
        const isLogin = req.originalUrl.includes('login');

        // ========== RENDERIZAR FORMULARIO DE REGISTRO ==========
        if(isRegister) {
            return res.render('auth/register', {
                errors: errors.array(),
                oldData: req.body,
                title: 'Registro',
                h1: 'Crear Cuenta'
            });
        }

        // ========== RENDERIZAR FORMULARIO DE LOGIN ==========
        if(isLogin) {
            return res.render('auth/login', {
                errors: errors.array(),
                oldData: req.body,
                title: 'Login',
                h1: 'Iniciar Sesión'
            });
        }

        // ========== RENDERIZAR FORMULARIO DE PRODUCTO ==========
        if(isProducto){
            try {
                const usuarios = await Usuario.findAll();
                const categorias = await Categoria.findAll();

                return res.render('productos/create', {
                    errors: errors.array(),
                    oldData: req.body,
                    title: 'Crear Producto',
                    h1: 'Nuevo Producto',
                    usuarios,
                    categorias
                })
            } catch (error) {
                console.log("Error cargando datos:", error);
                return res.redirect('productos/create')                
            }
        }

        // Si llegamos aquí, hay un error de configuración
        return res.status(500).send('Error de validación no manejado');
    }
}

module.exports = validations;