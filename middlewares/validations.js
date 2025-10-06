const {body, validationResult } = require("express-validator");
const { Usuario, Producto } = require('../database/models');
const fs = require('fs');
const validations = {
    // VALIDACIONES PARA LA CREACION DE USUARIOS

    usuario: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ min:2. ,max: 100})
            .trim(),
        body('email')
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
    ],
    // middleware para manejar errores de validacion
    handleErrors: (req, res,  next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log("errores de validacion encontrados: ", errors.array());

            // preparamos los datos para reenviar al formulario
            req.validtionErrors = errors.array();
            req.oldData = req.body; // datos que escribio el usuario

            //IMPORTANTE: SI hjay archivos y errores, eliminar los archivos
            if(req.file){
                fs.unlink(req.file.path, () => {})
            }
            if(req.files){
                req.files.forEach(file => {
                    fs.unlink(file.path, () => {})
                });
            }

            return res.redirect('/usuarios/create')          
        }
        // si no hay errores
        next();
    }

}

module.exports = validations;