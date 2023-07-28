const middleware = require("./middleware");

class redirectAuthenticated extends middleware{
    handle(req, res, next){
        if(req.isAuthenticated() && !res.headersSent) {
            return res.redirect('/');
        }
        next();
    }
}

module.exports = new redirectAuthenticated();