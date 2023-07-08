const express = require('express');
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const router = require('./routes/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
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
        mongoose.connect('mongodb://127.0.0.1/pro');
    }

    setConfig() {
        //static files (css, js, photo, ...)
        app.use(express.static(__dirname + '/public'));

        //template engines
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'resources/views'));
        app.use(expressLayouts);
        app.set('layout', 'master');

        // parse data in the requests
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        //define session and cookies and save them in db
        app.set('trust proxy', 1) // trust first proxy
        app.use(session({
            secret: 'amin-agha',
            resave: false,
            saveUninitialized: true,
            store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0/pro' }),
            cookie: { secure: false }   // it's true on https
        }));
        app.use(cookieParser());
        app.use(flash());
    }

    setRoutes() {
        app.use(router);
    }

}