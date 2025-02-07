const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('userdata', 'root', 'Admin123@', {
  host: 'localhost', 
  dialect: 'mysql',  
  logging: false,   
});

module.exports = sequelize;
