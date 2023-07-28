const User = require('./../../models/user');
const middleware = require('./middleware');

class rememberLogin extends middleware {
    handle(req, res, next) {
        if ( !req.isAuthenticated ){
            const rememberToken = req.signedCookies.remember_token;
            if (rememberToken){
                this.userFind(rememberToken, req, res)
            }
        }
        next()
    }

    userFind(rememberToken, req, res){
        User.findOne({rememberToken})
            .then(user =>{
                if(user){
                    req.login(user, err=>{
                        if(err) console.log(err);
                        next()
                    })
                }else{
                   next() 
                }
            })
    }
}

module.exports = new rememberLogin();