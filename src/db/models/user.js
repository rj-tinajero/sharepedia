'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false
     },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "id",
      as: "wikis"
    });
    User.belongsTo(models.Collaborator, {
      as: "collaborators",
      through: "Collaborator",
      foreignKey: "id"
    });
   
  };

  User.prototype.isPrem = function() {
    return this.role === 1;
  };
  // User.prototype.isCollab = function() {
  //   return 
  // }
  
  return User;
};