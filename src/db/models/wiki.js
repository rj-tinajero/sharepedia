'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    // associations can be defined here
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  
    Wiki.belongsToMany(models.User, {
      as: "collaborators",
      through: 'Collaborator',
      foreignKey: "wikiId"
    })
  };

  Wiki.prototype.getCollaboratorsFor = function(userId) {
    return this.collaborators.find((collaborator) => { return collaborator.userId == userId });
  };

  return Wiki;
};