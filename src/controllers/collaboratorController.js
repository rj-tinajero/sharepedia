const collabQueries = require('../db/queries.collaborators');

module.exports = {
   create(req, res, next) {
      let newCollab = {
         userId: req.user.id,
         wikiId: req.wiki.id
      };
      collabQueries.createCollaborator(newCollab, (err, collaborator) => {
         if(err) {
            console.log(err);
            res.redirect(`/wikis/${req.wiki.id}`);
         } else {
            res.redirect(`/wikis/${req.wiki.id}`);
         }
      })
   },
   destroy(req, res, next) {
      collabQueries.deleteCollaborator(req, (err, collaborator) => {
         if(err) {
            console.log(err);
            res.redirect(err, req.headers.referer);
      } else {
        res.redirect(req.headers.referer);
      }
      });
   }
}