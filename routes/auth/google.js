const express = require('express');
const router = express.Router();
const passport = require('passport')

//controller
//const loginController = require('../../app/http/controllers/auth/loginController')

//validators
//const loginValidator = require('../../app/http/validators/loginValidator')



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // This function will be called when the user successfully authenticates with Google.
    // You can redirect the user to a protected page in your application.
    res.redirect('/');
  });

module.exports = router