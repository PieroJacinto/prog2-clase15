'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('producto_imagenes', [
      // Producto 1: Laptop Gaming (2 imágenes)
      {
        producto_id: 1,
        imagen: 'laptop-gaming-1.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 1,
        imagen: 'laptop-gaming-2.jpeg',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Producto 2: Mouse Inalámbrico (2 imágenes)
      {
        producto_id: 2,
        imagen: 'mouse-inalambrico-1.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 2,
        imagen: 'mouse-inalambrico-2.png',
        created_at: new Date(),
        updated_at: new Date()
      },

      // Producto 3: Teclado Mecánico (1 imagen)
      {
        producto_id: 3,
        imagen: 'teclado-mecanico-1.png',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('producto_imagenes', null, {});
  }
};