const session = require('express-session');
// const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
// const JawboneStrategy = require('passport-jawbone').Strategy;
const User = require('../models/UserModel.js');


module.exports = (app, express, passport) => {
  app.use(session({
    name: 'fitomo',
    secret: 'fitomo',
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // // Passport Jawbone OAuth Strategy
  // passport.use(new JawboneStrategy({
  //   clientID: 'OWoCNkdQw6U',
  //   clientSecret: '9aa9e0a20c1b7279a416537e7b13b80b5c1c7155',
  //   callbackURL: '/auth/jawbone/callback',
  //   passReqToCallback: true, // lets Jawbone check if a user is logged in or not
  // },
  // (req, token, refreshToken, profile, done) => {
  //   User.find({ jawbone_id: profile.meta.user_xid }, (err, user) => {
  //     if (!user) {
  //       new User({ jawbone_id: profile.meta.user_xid })
  //         .save()
  //         .then((saveError, savedUser) => done(saveError, savedUser));
  //     }
  //   });
  // }
  // ));

  passport.serializeUser((user, done) => {
    done(null, user.get('id'));
  });

  passport.deserializeUser((id, done) => {
    User.where({ id })
      .fetch()
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
