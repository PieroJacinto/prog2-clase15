'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categorias', [
      {
        nombre: 'Tecnología',
        descripcion: 'Productos tecnológicos',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Gaming',
        descripcion: 'Productos para gamers',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Oficina',
        descripcion: 'Productos de oficina',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categorias', null, {});
  }
};