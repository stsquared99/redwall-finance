'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transactionId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    amountInCents: DataTypes.INTEGER,
    description: DataTypes.STRING,
    fromAccountType: DataTypes.ENUM({
      values: ['ATM', 'DEBIT', 'EXTERNAL', 'INTERNAL']
    }),
    fromAccountNumber: DataTypes.INTEGER,
    fromRoutingNumber: DataTypes.INTEGER,
    toAccountType: DataTypes.ENUM({
      values: ['ATM', 'DEBIT', 'EXTERNAL', 'INTERNAL']
    }),
    toAccountNumber: DataTypes.INTEGER,
    toRoutingNumber: DataTypes.INTEGER,
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};
