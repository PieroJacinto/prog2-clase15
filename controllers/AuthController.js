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
            // Los errores ya fueron validados por el middleware handleErrors
            // Si llegamos aquí, los datos son válidos
            
            const { nombre, email, password } = req.body;

            // Hashear el password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Preparar datos del usuario
            const datosUsuario = {
                nombre,
                email, 
                password: hashedPassword
            };

            // Agregar imagen de perfil si fue subida (opcional)
            if (req.file) {
                datosUsuario.imagen_perfil = req.file.filename;
            }

            // Crear el usuario en la DB
            const nuevoUsuario = await Usuario.create(datosUsuario);

            // Loguear automáticamente (guardar en sesión)
            req.session.userId = nuevoUsuario.id;
            req.session.userName = nuevoUsuario.nombre;
            req.session.successMessage = `¡Bienvenido/a ${usuario.nombre}!`;
            // Redirigir al home
            res.redirect('/');
            
        } catch (error) {
            console.log('ERROR EN EL REGISTRO: ', error);
            res.render('auth/register', {
                title: 'Registro',
                h1: 'Crear Cuenta',
                errors: [{msg: 'Error al crear usuario. Intenta nuevamente'}],
                oldData: req.body
            });
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
    processlogin: async(req, res) => {
        try {
            // Los errores ya fueron validados por el middleware handleErrors
            // Si llegamos aquí, el formato de datos es válido
            
            const { email, password } = req.body;

            // Buscar usuario en la base de datos
            const usuario = await Usuario.findOne({
                where: { email }
            });

            // Verificar si el usuario existe
            if (!usuario) {
                return res.render('auth/login', {
                    title: 'Login',
                    h1: 'Iniciar Sesión',
                    errors: [{msg: 'Credenciales inválidas'}],
                    oldData: req.body
                });
            }

            // Verificar la contraseña
            const passwordCorrecta = bcrypt.compareSync(password, usuario.password);
            
            if (!passwordCorrecta) {
                return res.render('auth/login', {
                    title: 'Login',
                    h1: 'Iniciar Sesión',
                    errors: [{msg: 'Credenciales inválidas'}],
                    oldData: req.body
                });
            }

            // Guardar datos en sesión
            req.session.userId = usuario.id;
            req.session.userName = usuario.nombre;

            // Redirigir al home
            res.redirect('/');

        } catch (error) {
            console.log('ERROR EN LOGIN: ', error);
            res.render('auth/login', {
                title: 'Login',
                h1: 'Iniciar Sesión',
                errors: [{msg: 'Error al iniciar sesión. Intenta nuevamente'}],
                oldData: req.body
            });
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