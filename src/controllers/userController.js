const userQueries = require("../db/queries.users");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const keyPublishable = process.env.STRIPE_PUBLISH_KEY;
console.log("keyPublishable", keyPublishable);
const keySecret = process.env.STRIPE_SECRET_KEY;
console.log("keySecret", keySecret);
const stripe = require("stripe")(keySecret);

module.exports = {
    signup(req, res, next) {
        res.render("users/signup");
    },
    create(req, res, next){ 
             let newUser = {
               email: req.body.email,
               password: req.body.password,
               passwordConfirmation: req.body.passwordConfirmation
             };
             userQueries.createUser(newUser, (err, user) => {
               if(err){
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
      console.log(req.body);
      stripe.tokens.create({
        card: {
          number: '4242424242424242',
          exp_month: 12,
          exp_year: 2020,
          cvc: '123'
        }
      }, function(token) {
      stripe.customers.create({
        email: req.user.email
      })
      .then(customer => 
        stripe.charges.create({
          amount: 1500,
          description: "Premium Plan",
          currency: "usd",
          customer: customer.id,
          card: token
        }))
      .then(charge => res.send(charge))
      .catch(err => {
        console.log("Error:", err);
        res.status(500).send({error: "Purchase Failed"});
      });
    
    });
        
  }

  
}