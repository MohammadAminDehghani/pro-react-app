const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;     
const User = require('../models/user')

//Configure passport to manage sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Configure the google strategy
passport.use(new GoogleStrategy({
    // clientID: '375155353142-n1hufd95ijf9iar4kahpcls0a7nnbc54.apps.googleusercontent.com',
    // clientSecret: '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',
    clientID: config.service.Google.clientID,
    clientSecret: config.service.Google.clientSecret,   
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },

  function(accessToken, refreshToken, profile, done) {
    // Find or create a user with the given email address
    User.findOne({ email: profile.emails[0].value }).exec()
      .then(user => {
        if (user) {
          // If the user already exists, update their profile information
          user.name = profile.displayName;
          user.photo = profile.photos[0].value;
        } else {
          // If the user does not exist, create a new user with the given profile information
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            password: profile.id
          });
        }
  
        // Save the user to the database
        return user.save();
      })
      .then(user => {
        // Return the user to Passport.js
        done(null, user);
      })
      .catch(err => {
        console.error('Error saving user:', err);
        done(err);
      });
  }
));

