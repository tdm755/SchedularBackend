
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const IncomeExpense = sequelize.define('IncomeExpense', {
    income: {
      type: DataTypes.INTEGER
    },
    expense: {
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    timestamps: true
  });
  
  
  
  
  module.exports = IncomeExpense;