'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    });

    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "user"
    });
    
  };

  User.prototype.isPrem = function() {
    return this.role === 1;
  };
  User.prototype.isCollab = function(userId) { 
    return this.collaborators.find((collaborator) => { return collaborator.userId == userId})
  }
  
  return User;
};