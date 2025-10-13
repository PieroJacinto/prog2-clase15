const path = require("path");
const db = require('../database/models');
const { log } = require("console");
const fs = require('fs'); // agregamos para manejar archivos

const userController = {
    index: async (req, res) => {
        try {
            const usuarios = await db.Usuario.findAll({
                order:[['created_at', 'DESC']]
            });
            console.log('usuarios: ', JSON.stringify(usuarios, null, 4 ));
            res.render('usuarios/index',{
                title: 'Usuarios desde la BD',
                usuarios: usuarios,
                h1: 'Usuarios desde la BD'
            })
        
        } catch (error) {
            console.log("error obteniedo los usuarios de la db: ", error.message);            
        }
    },
    show: async(req, res ) => {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id)
            
            console.log(JSON.stringify(usuario, null, 4))
            if(!usuario) {
                return res.render('errors/404',{
                    title: "ERROR",
                    mensaje: "usuario no encontrado ",
                    h1: "errores",
                    url: req.url
                })           
            }
            res.render('usuarios/show',{
                title: `Usuario: ${usuario.nombre}`,
                h1: "Mi pagina de detalle de usuario",
                usuario: usuario
            })
        } catch ( e ) {
            console.log("error obteniendo el usuario:", e);
            res.render('errors/404', {
                    title: "ERROR",
                    mensaje: "error cargando usuario ",
                    h1: "errores",
                    url: req.url
            })

            
        }
    },
    create: async(req,res) => {
        res.render('usuarios/create',{
            title: 'Crear Usuario',
            h1: 'Nuevo Usuario',
            errors: [],
            oldData: {}
        })
    },
    store: async(req, res) => {
        try {
            // paso 1: EXTRAER datos del formulario
            const {nombre, email} = req.body;

            // paso 2: CONSTRUIMOS objeto con datos basicos
            const userData = {
                nombre: nombre.trim(),
                email: email.trim()
            }

            // paso 3: VERIFICAR si se subio una imagen
            if( req.file){
                console.log("req.file: ", req.file);
                
                //req.file existe cuando Multer proceso exiotopsamente un archivo
                // si existe lo agregamos a nuestro userData
                userData.imagen = req.file.filename; // agregamos el nombre del archivo

                // solo para ver el req.file, y que info nos trae el archivo
                console.log('archivo subido:', {
                    originalName: req.file.originalname,
                    fileName: req.file.filename,
                    size: req.file.size,
                    path: req.file.path
                });

                //paso 4: Creamos el usuario en la base de datos
                const nuevoUsuario = await db.Usuario.create(userData);

                console.log("Usuario creado: ", nuevoUsuario.id);
                // redirigimos a el perfil del usuario
                res.redirect(`/usuarios/${nuevoUsuario.id}`)               

            }

        } catch (error) {
            console.log('Error creando usuario:', error);

            res.render('usuarios/create',{
                errors: [{msg:'Error creando Usuario'}],
                oldData:req.body,
                title: "Crear Usuario",
                h1: "Nuevo Usuario"
            });       
            
        }
    }
    
    
}

module.exports = userController;