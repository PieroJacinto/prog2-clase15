'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('producto_categorias', [
      // Laptop Gaming está en Tecnología y Gaming
      {
        producto_id: 1, // Laptop Gaming
        categoria_id: 1, // Tecnología
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 1, // Laptop Gaming
        categoria_id: 2, // Gaming
        created_at: new Date(),
        updated_at: new Date()
      },
      // Mouse está en Tecnología y Oficina
      {
        producto_id: 2, // Mouse
        categoria_id: 1, // Tecnología
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 2, // Mouse
        categoria_id: 3, // Oficina
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('producto_categorias', null, {});
  }
};