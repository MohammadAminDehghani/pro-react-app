const mongoose = require('mongoose');
const session  = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = {
        secret: 'amin-agha',
        secret : 'secretID',
        resave : true,
        saveUninitialized : true,
        store : new MongoStore({ mongooseConnection : mongoose.connection }),
        cookie: { secure: false }   // it's true on https
}