const collabQueries = require('../db/queries.collaborators');


// module.exports = {

//    destroy(req, res, next) {
//       collabQueries.deleteCollaborator(req, (err, collaborator) => {
//          if(err) {
//             console.log(err);
//             res.redirect(err, req.headers.referer);
//       } else {
//         res.redirect(req.headers.referer);
//       }
//       });
//    }
// }

const express = require('express');
const router = express.Router();
const Wiki = require('../db/models').Wiki;
const User = require('../db/models').User;
const Collaborator = require('../db/models').Collaborator;

module.exports = {
   //    create(req, res, next) {
   //    let newCollab = {
   //       userId: req.user.id,
   //       wikiId: req.params.id
   //    };
   //    collabQueries.createCollaborator(newCollab, (err, collaborator) => {
   //       if(err) {
   //          console.log(err);
   //          res.redirect(`/wikis/${req.params.id}`);
   //       } else {
   //          res.redirect(`/wikis/${req.params.id}`);
   //       }
   //    })
   // },
   destroy(req, res, next) {
      console.log("BEFORE PROMISE", req.headers);
         collabQueries.deleteCollaborator(req, (err) => {
            if(err) {
               
               res.redirect(err, req.headers.referer);
            } else { 
               console.log(req.headers);
            res.redirect(req.headers.referer);
         }
      });
   },
   // destroy(req, res, next){
   //    Collaborator.destroy({where: {id: req.params.collabId}})
   //        .then(collaborator => {
   //           req.flash("notice", "Collaborator was removed successfully.")
   //           res.redirect(req.headers.referer);
   //        })
   //        .catch(err => {
   //          res.redirect(`/wikis/${req.params.id}/edit`)
   //        });
   
   create(req, res, next){ 
      User.findOne({where: {id: req.body.user}})
          .then(user => {
             if (user) { 
                Wiki.findOne({where: {id: req.params.id}})
                .then(wiki => {
                  let collaborator = Collaborator.build({
                     userId: req.body.user,
                     wikiId: req.body.wiki
                  })
                   collaborator.save();

                req.flash("notice", "Collaborator has been successfully added!")
                res.redirect(req.headers.referer);
                });
               
             }
             else {
                req.flash("notice", "Collaborator email not found.  Please try again.")
                res.redirect(req.headers.referer);
             }
          })
          .catch(err => { console.log(err);
             req.flash("error", "Error saving wiki.  Please try again.")
             res.redirect(`/wikis/${req.params.id}/edit`);
          });
   }
}