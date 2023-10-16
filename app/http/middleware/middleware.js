const autoBind = require('auto-bind');

module.exports = class middleware {
    constructor(){
        autoBind(this);
    }

    error(message, statusCode = 500){
        let err = new Error(message);
        err.statusCode = statusCode;
        throw err;
    }
}