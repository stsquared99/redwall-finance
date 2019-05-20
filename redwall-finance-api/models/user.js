'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Account, {
      foreignKey: 'userId',
      onDelete: 'SET NULL'
    });
  };
  return User;
};
