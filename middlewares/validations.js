const {body, validationResult } = require("express-validator");
const { Usuario, Producto } = require('../database/models');
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
    // middleware para manejar errores de validacion
    handleErrors: (req, res,  next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log("errores de validacion encontrados: ", errors.array());

            //IMPORTANTE: SI hjay archivos y errores, eliminar los archivos
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
        }
        // si no hay errores, continuar
        next();
    }

}

module.exports = validations;