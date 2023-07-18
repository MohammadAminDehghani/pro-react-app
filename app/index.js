const express = require('express');
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const router = require('./../routes/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
// const { config } = require('process');
// const { config } = require('process');
const app = express()
const port = 3000

module.exports = class Application {

    constructor() {
        this.configServer();
        this.configDatabase();
        this.setConfig();
        this.setRoutes();
    }

    configServer() {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        })
    }

    configDatabase() {
        global.AbortControllerPromise = mongoose.Promise;
        mongoose.connect(config.database.url);
    }

    setConfig() {
        //require('./passport/passport-local')
        //static files (css, js, photo, ...)
        app.use(express.static(config.layout.PUBLIC_DIR));

        //template engines
        app.set('view engine', config.layout.VIEW_ENGINE);
        app.set('views', path.join(config.layout.VIEW_DIR));
        app.use(config.layout.EJS.expressLayouts);
        app.set('layout',config.layout.EJS.master);
        app.set('layoutStyles',config.layout.EJS.layoutStyles);
        app.set('expressLayouts',config.layout.EJS.expressLayouts);
        // parse data in the requests
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        //define session and cookies and save them in db
        app.set('trust proxy', 1) // trust first proxy
        app.use(session({ ...config.session
            // secret: 'amin-agha',
            // resave: false,
            // saveUninitialized: true,
            // store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0/pro' }),
            // cookie: { secure: false }   // it's true on https
        }));
        app.use(cookieParser());
        app.use(flash());


        // Initialize Passport and restore authentication state, if any, from the session
        app.use(passport.initialize());
        app.use(passport.session());
    }

    setRoutes() {
        app.use(router);
    }

}