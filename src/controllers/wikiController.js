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
        res.render("wikis/new", {markdown});
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
        wikiQueries.getWiki(req.params.id, (err, wiki) => { 
            if(err || wiki == null) {
                console.log(err);
                res.redirect(404, "/");
            } else {
                if(!wiki.private || wiki.userId === req.user.id || wiki.collaborators.find(c => c.userId === req.user.id)) {
                    res.render("wikis/show", {wiki, markdown});
                } else {
                    res.redirect(401, "/");
                }
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
      if(err) { 
          res.redirect(404, "/");
      } else { 
        wikiQueries.getWiki(req.params.id, (err, wiki) => { 
            if(err || wiki == null) {
                res.redirect(404, "/");
            } else {
                if(req.user && wiki.userId === req.user.id || wiki.collaborators.find(c => c.userId === req.user.id)) {
                res.render("wikis/edit", {wiki, users, markdown});
                } else {
                    res.redirect(401, "/");
                }
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