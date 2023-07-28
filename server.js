// Add the root project directory to the app module search path:
require('app-module-path').addPath(__dirname);

require('dotenv').config()
config = require('./config')
const App = require('./app')
new App();