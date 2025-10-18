'use strict';
const bcrypt = require("bcryptjs");

const { query } = require('express-validator');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('usuarios',[
      {
        nombre: "Diego Comisso",
        email: "diego@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        imagen: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Piero Jacinto",
        email: "piero@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        imagen: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Maria Garcia",
        email: "maria@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        imagen: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: "Admin Sistema",
        email: "admin@test.com",
        password: bcrypt.hashSync("admin123", 10),
        imagen: null,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {})
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {})
  }
};
