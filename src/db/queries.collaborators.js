const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;

module.exports = {
   createCollaborator(newCollab, callback) {
      return Collaborator.create(newCollab) 
      .then((collaborator) => {
         callback(null, collaborator);
      })
      .catch((err) => {
         callback(err);
      });
   },
   deleteCollaborator(req, callback) {
      return Collaborator.findByPk(req.params.id)
      .then((collaborator) => {
         collaborator.destroy();
      })
      .catch((err) => {
         callback(err);
      })
   }
}

