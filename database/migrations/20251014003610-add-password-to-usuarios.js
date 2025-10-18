'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    
     await queryInterface.addColumn('usuarios', 'password', { 
       type: Sequelize.STRING(255),
       allowNull: false,
       defaultValue: '' // para usuarios existentes
    });
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'password')
  }
};
