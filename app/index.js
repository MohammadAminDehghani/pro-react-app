const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const webRouter = require('routes/index');
const apiRouter = require('routes/api/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const rememberLogin = require('app/http/middleware/rememberLogin');
const multer = require('multer');
const methodOverride = require('method-override');
const Helper = require('app/helper');
const access = require('app/accessUser');
//const socketIo = require('socket.io');
const chatController = require('app/http/controllers/admin/chatController');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const { createHandler } = require('graphql-http');
const schema = require('app/graphql/schema'); // GraphQL schema
const rootValue = require('app/graphql/resolver.js'); // GraphQL resolvers

// const http = require('http');
// const { createHandler } = require('graphql-http/lib/use/http');
// const schema = require('app/graphql/schema'); // GraphQL schema

// Create the GraphQL over HTTP Node request handler
const handler = createHandler({ schema });

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

        const server = createServer(app);
        const io = new Server(server);
        chatController.connectToSocket(io);


        server.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
            //console.log(config)
        })
    }

    configDatabase() {
        global.AbortControllerPromise = mongoose.Promise;
        mongoose.connect(config.database.url);
    }

    setConfig() {
        //passport strategies
        require('./passport/passport-local');
        require('./passport/passport-google');
        require('./passport/passport-jwt');

        //static files (css, js, photo, ...)
        app.use(express.static(config.layout.PUBLIC_DIR));

        // Set up static file serving
        //app.use(express.static(path.join(__dirname, 'public')));

        //template engines
        app.set('view engine', config.layout.VIEW_ENGINE);
        app.set('views', path.join(config.layout.VIEW_DIR));
        app.use(config.layout.EJS.expressLayouts);
        app.set('layout', config.layout.EJS.master);
        app.set('layoutStyles', config.layout.EJS.layoutStyles);
        app.set('expressLayouts', config.layout.EJS.expressLayouts);
        // parse data in the requests
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        //define session and cookies and save them in db
        app.set('trust proxy', 1) // trust first proxy
        app.use(session({
            ...config.session
            // secret: 'amin-agha',
            // resave: false,
            // saveUninitialized: true,
            // store: MongoStore.create({ mongoUrl: 'mongodb://0.0.0.0/pro' }),
            // cookie: { secure: false }   // it's true on https
        }));
        app.use(cookieParser(config.session.secret));
        app.use(flash());


        // Initialize Passport and restore authentication state, if any, from the session
        app.use(passport.initialize());
        app.use(passport.session());

        //remember login => set cookie
        app.use(rememberLogin.handle)

        // set up middleware to pass user to views
        app.use((req, res, next) => {
            res.locals.currentUser = req.user;
            next();
        });

        // set up middleware for Helper to pass methods to views
        app.use((req, res, next) => {
            app.locals = new Helper(req, res).Object();
            next();
        });

        // override with POST having ?_method=DELETE
        app.use(methodOverride('_method'));

        //ACL settings
        app.use(access.middleware());



        // Create the GraphQL over HTTP Node request handler
        const handler = createHandler({ schema, rootValue });

        // Apply the request handler to the '/graphql' endpoint
        app.use('/graphql', (req, res) => {
            handler(req, res);
        });

    }

    setRoutes() {

        app.use(apiRouter);
        app.use(webRouter);
    }

}