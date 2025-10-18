const bcrypt = require("bcryptjs");
const{ Usuario } = require('../database/models');

const authController = {
    //REGISTRO

    //MOSTRAR FORM DE REGISTO
    registerForm: (req, res) => {
        res.render('auth/register', {
            title: 'Registro',
            h1: 'Crear Cuenta',
            errors: [],
            oldData: {}
        });
    },

    processRegister: async(req, res) => {
        try {
            const { nombre, email, password } = req.body;

            //1 verificamos si el email existe
            const usuarioExistente = await Usuario.findOne({
                where: { email }
            })

            if(usuarioExistente){
                return  res.render('auth/register', {
                    title: 'Registro',
                    h1: 'Crear Cuenta',
                    errors: [{msg: 'El email ya esta registrado'}],
                    oldData: req.body
                });
            }

            // paso 2: hashear el password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // paso 3: crear el usuario en la DB
            const nuevoUsuario = await Usuario.create({
                nombre,
                email, 
                password: hashedPassword
            })

            // paso 4: Loguear automaticamente, (guardar en sesion)
            req.session.userId = nuevoUsuario.id;
            req.session.userName = nuevoUsuario.nombre;

            // paso 5 : redirigir al home
            res.redirect('/')
        } catch (error) {
            console.log(' ERROR EN EL REGISTRO: ', error);
            res.render('auth/register', {
                 title: 'Registro',
                h1: 'Crear Cuenta',
                errors: [{msg: 'ERROR AL CREAR USUARIO'}],
                oldData: req.body
            })            
        }
    },
    login: (req, res) =>{
        res.render('auth/login', {
            title: "Login",
            h1: 'Iniciar Sesion',
            errors: [],
            oldData: {}
        })
    },
    processlogin: async(req, res ) => {
        try {
            // 1- traer datos del form
            const { email, password} = req.body;
            // 2 - buscar en base de datos si el usuario existe por el email.
            const usuario = await Usuario.findOne({
                where: {email}
            });           
            
            // 3- si no existe, , redirigir nuevamente a login y mostrar error al loguearse. 
            if(!usuario){
                return res.render('auth/login', {
                    title: "Login",
                    h1: 'Iniciar Sesion',
                    errors: [{msg: 'Credenciales Invalidas'}],
                    oldData: req.body
                })
            };
            // 4 - si existe,  verificamos el password
            const passwordValido = bcrypt.compareSync(
                password, // password ingresado en el form
                usuario.password
            );
            // 5- si el password no es valido, volver a renderisar login
            if(!passwordValido){
                return res.render('auth/login', {
                    title: "Login",
                    h1: 'Iniciar Sesion',
                    errors: [{msg: 'Credenciales Invalidas'}],
                    oldData: req.body
                })
            }
            // 6 si el password, es valido, guardar en sesion
            req.session.userId = usuario.id
            req.session.userName = usuario.nombre
            // 7-redirigo al home. 
            res.redirect('/')
        } catch (error) {
            console.error('Error en el login', error);
            return res.render('auth/login', {
                    title: "Login",
                    h1: 'Iniciar Sesion',
                    errors: [{msg: 'Error al iniciar sesion'}],
                    oldData: req.body
                })
        }
    },
    logout: ( req, res ) => {
        req.session.destroy((err)=>{
            if(err){
                console.error("Error al cerrar sesion: ",  err)
            }
            res.redirect("/");
        })
    }
}

module.exports = authController;