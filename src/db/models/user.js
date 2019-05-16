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
      foreignKey: "userId",
      as: "wikis"
    });
    // User.belongsTo(models.Collaborator, {
    //   as: "Collaborator",
    //   foreignKey: "userId"
    // });
   
  };

  User.prototype.isPrem = function() {
    return this.role === 1;
  };
  
  
  return User;
};