const wikiQueries = require("../db/queries.wikis");
const userQueries = require("../db/queries.users");
const markdown = require( "markdown" ).markdown;

module.exports = {
    index(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {
            if(err) {
                console.log(err);
                res.redirect(500, "/");
            } else { 
                res.render("wikis/index", {wikis});
            }
        })
    },
    new(req, res, next) {
        res.render("wikis/new");
    },
    create(req, res, next) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err) { 
                res.redirect(500, "/wikis/new");
            } else { 
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    },
    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => { console.log(err);
            if(err || wiki == null) {
                console.log(err);
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", {wiki, markdown});
            }
        });
    },
    destroy(req, res, next) {
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
            if(err) {
                res.redirect(500, `/wikis/${wiki.id}`);
            } else {
                res.redirect(303, "/wikis");
            }
        });
    },
    edit(req, res, next) {
        userQueries.getAllUsers((err, users) => {
      if(err) { console.log(err, "edit function of wikicontroller");
          res.redirect(404, "/");
      } else { 
        wikiQueries.getWiki(req.params.id, (err, wiki) => { 
            if(err || wiki == null) {
                console.log(err, "edit getWiki function of wikicontroller");
                res.redirect(404, "/");
            } else {
                res.render("wikis/edit", {wiki, users});
            }
        });
      }
    });
        
    },
    update(req, res, next) {
        
        wikiQueries.updateWiki(req.params.id, req.body, (err, wiki) => {
            if(err || wiki == null) {
                res.redirect(404, `/wikis/${req.body.id}/edit`);
            } else {
                res.redirect(`/wikis/${wiki.id}`);
            }
        });
    }
}