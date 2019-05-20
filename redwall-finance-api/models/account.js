'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    accountNumber: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    routingNumber: DataTypes.INTEGER,
    balance: DataTypes.DOUBLE,
    type: DataTypes.ENUM({
      values: ['CHECKING', 'SAVINGS']
    }),
    active: DataTypes.BOOLEAN
  }, {});
  Account.associate = function(models) {
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'SET NULL'
    });
  };
  return Account;
};
