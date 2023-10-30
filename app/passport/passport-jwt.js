const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('app/models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// Configure the jwt strategy
var opts = {}
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
opts.secretOrKey = config.jwt.secretKey;
//opts.issuer = 'accounts.examplesoft.com';
//  opts.audience = 'yoursite.net';
passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {

try {
    const user = await User.findOne({ _id: jwt_payload._id });
    if (user) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'شما برای ورود دسترسی ندارید.' });
        // or you could create a new account
    }
} catch (err) {
    return done(err, false);
}

    // User.findOne({ '_id': jwt_payload._id }, function (err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false, { message: 'شما برای ورود دسترسی ندارید.' });
    //         // or you could create a new account
    //     }
    // });
}));






// passport.use('local.register', new localStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, async (req, email, password, done) => {
//     try {
//         const user = await User.findOne({ 'email': email }).exec();
//         if (user) {
//             return done(null, false, req.flash('errors', {
//                 name: 'exist',
//                 message: 'این اطلاعات قبلا در سیستم ثبت شده است'
//             }));
//         }
//         const addUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//         });
//         await addUser.save();
//         done(null, addUser);
//     } catch (err) {
//         done(err, false, req.flash('errors', 'امکان ذخیره اطلاعات وجود ندارد'));
//     }
// }));


// passport.use('local.login', new localStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, async (req, email, password, done) => {
//     try {
//         const user = await User.findOne({ 'email': email }).exec();
//         if (!user) {
//             return done(null, false, req.flash('errors', {
//                 name: 'notExist',
//                 message: 'همچین نام کاربری وجود ندارد'
//             }));
//         }
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return done(null, false, req.flash('errors', {
//                 name: 'notMatch',
//                 message: 'نام کاربری یا کلمه عبور اشتباه است'
//             }));
//         }
//         // If email and password are both correct, return the authenticated user
//         done(null, user);
//     } catch (err) {
//         done(err, false, req.flash('errors', {
//             name: 'error',
//             message: 'امکان ورود به سیستم وجود ندارد'
//         }));
//     }
// }));

