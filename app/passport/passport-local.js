const passport = require('passport');
const localStrategy = require('passport-local');        
const User = require('./../models/user')

//Configure passport to manage sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Configure the local strategy

passport.use('local.register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ 'email': email }).exec();
        if (user) {
            return done(null, false, req.flash('errors', {
                name: 'exist',
                message: 'این اطلاعات قبلا در سیستم ثبت شده است'
            }));
        }
        const addUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        await addUser.save();
        done(null, addUser);
    } catch (err) {
        done(err, false, req.flash('errors', 'امکان ذخیره اطلاعات وجود ندارد'));
    }
}));


passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ 'email': email }).exec();
        if (!user) {
            return done(null, false, req.flash('errors', {
                name: 'notExist',
                message: 'همچین نام کاربری وجود ندارد'
            }));
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, req.flash('errors', {
                name: 'notMatch',
                message: 'نام کاربری یا کلمه عبور اشتباه است'
            }));
        }
        // If email and password are both correct, return the authenticated user
        done(null, user);
    } catch (err) {
        done(err, false, req.flash('errors', {
            name: 'error',
            message: 'امکان ورود به سیستم وجود ندارد'
        }));
    }
}));

