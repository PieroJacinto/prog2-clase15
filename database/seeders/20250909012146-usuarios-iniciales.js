"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nombre: "Juan Pérez",
          email: "juan@email.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "María García",
          email: "maria@email.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "Carlos Rodriguez",
          email: "carlos@email.com",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
