const { Usuario } = require('../database/models');

const userController = {
    // Listar todos los usuarios
    index: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.render('usuarios/index', {
                title: 'Usuarios',
                h1: 'Lista de Usuarios',
                usuarios
            });
        } catch (error) {
            console.log('ERROR AL LISTAR USUARIOS:', error);
            res.status(500).send('Error al obtener usuarios');
        }
    },

    // Ver detalle de un usuario
    show: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).send('Usuario no encontrado');
            }

            res.render('usuarios/show', {
                title: `Usuario: ${usuario.nombre}`,
                h1: 'Detalle del Usuario',
                usuario
            });
        } catch (error) {
            console.log('ERROR AL MOSTRAR USUARIO:', error);
            res.status(500).send('Error al obtener usuario');
        }
    }

    // NOTA: create y store fueron eliminados
    // El registro de usuarios se hace en AuthController
};

module.exports = userController;