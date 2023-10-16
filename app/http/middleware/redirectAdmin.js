const middleware = require('app/http/middleware/middleware')

class redirectAdmin extends middleware {
    handle(req, res, next){
        if(req.isAuthenticated() && req.user.admin){
            next()
        }else{
            res.redirect('/auth/login')
        }
    }
}

module.exports = new redirectAdmin()