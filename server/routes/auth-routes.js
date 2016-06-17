const FitbitAuthController = require('./../controllers/FitbitAuthController.js');
const JawboneAuthController = require('./../controllers/JawboneAuthController.js');

module.exports = (app) => {
  app.get('/auth/fitbit', FitbitAuthController.fitbitLogin);
  app.get('/auth/fitbit/callback', FitbitAuthController.fitbitCallback);

  app.get('/auth/jawbone', JawboneAuthController.jawboneLogin);
  app.get('/auth/jawbone/callback', JawboneAuthController.jawboneCallback);

  app.get('/',
  (req, res) => {
    if (req.session.user) {
      res.render('index');
    } else {
      res.render('login');
    }
  });

  app.get('/login',
  (req, res) => {
    res.render('login');
  });

  app.get('/logout',
  (req, res) => {
    req.logout();
    req.session.destroy();
    res.render('login');
  });
};
