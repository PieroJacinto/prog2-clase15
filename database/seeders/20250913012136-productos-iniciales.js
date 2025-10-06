"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "productos",
      [
        {
          nombre: "Laptop Gaming",
          precio: 150000.0,
          descripcion: "Laptop para gaming de alta gama",
          usuario_id: 1, 
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "Mouse Inalámbrico",
          precio: 5000.0,
          descripcion: "Mouse ergonómico para oficina",
          usuario_id: 1, // Juan tiene 2 productos
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "Teclado Mecánico",
          precio: 8500.0,
          descripcion: "Teclado mecánico RGB",
          usuario_id: 2, // María tiene 1 producto
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {   
     await queryInterface.bulkDelete('productos', null, {});     
  },
};
