const FitbitClient = require('fitbit-client-oauth2');
const client = new FitbitClient('227V3M', 'fde5c9f2a90368d2bc20b4a5d60dd76c');
const redirectUri = 'http://127.0.0.1:8080/auth/fitbit/callback';
const User = require('../models/UserModel.js');

module.exports = {
  fitbitLogin: (req, res) => {
    const scope = 'activity profile settings sleep weight heartrate';
    const authorizationUri = client.getAuthorizationUrl(redirectUri, scope);
    res.redirect(authorizationUri);
  },

  fitbitCallback: (req, res, done) => {
    const code = req.query.code;
    client.getToken(code, redirectUri)
    .then((token) => {
      const fitbitId = token.token.user_id;

      // CALL MICROSERVICE HERE TO GET DATA

      User.where({ fitbit_id: fitbitId })
        .fetch()
        .then(user => {
          console.log('TOKEN', token.token);
          if (!user) {
            const newUser = new User({
              device: 'Fitbit',
              fitbit_id: fitbitId,
              accessToken: token.token.access_token,
              refreshToken: token.token.refresh_token,
            });
            newUser.save()
              .then((saveError, savedUser) => {
                req.session.user = newUser.get('id');
                req.session.save();
                done(saveError, savedUser);
              });
          } else {
            user.set({
              accessToken: token.token.access_token,
              refreshToken: token.token.refresh_token,
            }).save();
            req.session.user = user.get('id');
            req.session.save();
          }
        })
        .then(() => {
          res.status(302).redirect('/');
        });
    })
    .catch((err) => {
      // MORE PRECISE ERROR HANDLING?
      res.status(500).send(err);
    });
  },
};