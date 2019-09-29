const userQueries = require("../db/queries.users");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const keyPublishable = process.env.STRIPE_PUBLISH_KEY;
const keySecret = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")('sk_test_h2rI1fERunxVIz32Gn6r7KIr00M5ITVe9M');

module.exports = {
    signup(req, res, next) {
        res.render("users/signup");
    },
    create(req, res, next){ console.log("IM HERE BEFORE USER CREATED");
             let newUser = {
               name: req.body.name,
               email: req.body.email,
               password: req.body.password,
               passwordConfirmation: req.body.passwordConfirmation
             };
             userQueries.createUser(newUser, (err, user) => {
               if(err){
                 console.log(err, "IM HERE IN IF STATEMENT FOR USERQUIRES");
                 req.flash("error", err);
                 res.redirect("/users/signup");
               } else {
                 passport.authenticate("local")(req, res, () => {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    const msg = {
                      to: `${req.body.email}`,
                      from: 'team@sharepedia.com',
                      subject: 'Sending with SendGrid is Fun',
                      text: 'and easy to do anywhere, even with Node.js',
                      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                    };
                    sgMail.send(msg)
                    .then(() => {
                        //Celebrate
                    })
                    .catch(error => {
                        //Log friendly error
                        console.error(error.toString());
                        //Extract error msg
                        const {message, code, response} = error;
                        //Extract response msg
                        const {headers, body} = response;
                    });
                   req.flash("notice", "You've successfully signed in!");
                   res.redirect("/");
                 })
               }
            });
        },
    signinForm(req, res, next) {
        res.render("users/signin");
    },
    signin(req, res, next) {
        passport.authenticate("local", {session: true})(req, res, function () { 
            if(!req.user){
              req.flash("notice", "Sign in failed. Please try again.")
              res.redirect("/users/signin");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
          })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
      },
    chargeForm(req, res, next) {
      res.render("users/charge", {keyPublishable})
    },  
    charge(req, res, next) {
      const token = req.body.stripeToken;
      stripe.customers.create({
        email: req.user.email,
        source: token
      })
      .then(customer => {
        stripe.charges.create({
          amount: 1500,
          description: "Premium Plan",
          currency: "usd",
          customer: customer.id,
          card: token.id
        }, (err, charge) => {
          if(charge) {
            req.flash("notice", "You've successfully upgraded your plan!");
            req.user.role += 1;
            req.user.save();
            res.redirect("/");
          } 
        })})
        .catch((err) => {
          console.log("Error:", err);
          res.status(500).send({error: "Purchase Failed"});
        })
        
      
  },
  downGrade(req, res, next) {
    if(req.user.role === 1) {
      req.user.role -= 1;
      req.user.save();
    }
    userQueries.makeWikisPub(req.user.id, (err) => {
      if(err) {
        console.log(err);
      res.redirect("/");
      } else {
        res.redirect("/");
      }
    })
    res.redirect("/");
  },
  index(req, res, next) {
    userQueries.getAllUsers((err, users) => {
      if(err) { console.log(users);
          res.redirect(404, "/");
      } else { 
          res.render("users/index", {users});
      }
    });
  }

  
}