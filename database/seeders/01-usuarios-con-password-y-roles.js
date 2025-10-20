'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('usuarios', [
            {
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                password: bcrypt.hashSync('123456', 10),
                rol: 'user',
                imagen: null, // ⬅️ CAMBIAR de imagen_perfil a imagen
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nombre: 'María García',
                email: 'maria@test.com',
                password: bcrypt.hashSync('123456', 10),
                rol: 'user',
                imagen: null, // ⬅️ CAMBIAR
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nombre: 'Admin Sistema',
                email: 'admin@test.com',
                password: bcrypt.hashSync('admin123', 10),
                rol: 'admin',
                imagen: null, // ⬅️ CAMBIAR
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nombre: 'Pedro Ruiz',
                email: 'pedro@test.com',
                password: bcrypt.hashSync('123456', 10),
                rol: 'user',
                imagen: null, // ⬅️ CAMBIAR
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                nombre: 'Ana Lopez',
                email: 'ana@test.com',
                password: bcrypt.hashSync('123456', 10),
                rol: 'admin',
                imagen: null, // ⬅️ CAMBIAR
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('usuarios', {
            email: [
                'juan@test.com',
                'maria@test.com', 
                'admin@test.com',
                'pedro@test.com',
                'ana@test.com'
            ]
        }, {});
    }
};