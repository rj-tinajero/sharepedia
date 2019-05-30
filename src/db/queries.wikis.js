const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {
    getAllWikis(callback) {
        return Wiki.findAll({
            include: [
                {
                    model: Collaborator,
                    as: "collaborators"
                }
            ]
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addWiki(newWiki, callback) {
        return Wiki.create(newWiki)
        .then((wiki) => {
            callback(null, wiki)
        })
        .catch((err) => {
            console.log(err.toString());
            callback(err); 
        })
    },
    getWiki(id, callback) {
        return Wiki.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user"
                },
                {
                    model: Collaborator,
                    as: "collaborators"
                }
            ]
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        })
    },
    deleteWiki(id, callback) {
        return Wiki.destroy({
            where: {id}
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },
    updateWiki(id, updatedWiki, callback){
        return Wiki.findByPk(id)
        .then((wiki) => {
          if(!wiki){
            return callback("Wiki not found");
          }
          wiki.update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          });
        });
      }
    
}