const controller = require('../controller');
const passport = require('passport');

class loginController extends controller {

    get(req, res) {
        res.render('auth/login', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }


    async post(req, res, next) {
        await this.validationRecaptcha(req, res)
            const result = await this.validationForm(req, res)

            if (result) {
                this.login(req, res, next)
            }

    }

    login(req, res, next)  {
        passport.authenticate('local.login', (err, user) => {
            if(!user) return res.redirect('/auth/login')
            // if(err) console.log('loginController'+err)
            // return res.redirect('/') 
            req.login(user, err=>{
                if(err) console.log(err)
                return res.redirect('/') 
            })
        })(req, res, next)
    }


    put(req, res) {
        // Handle PUT request to /my-route
    }

    delete(req, res) {
        // Handle DELETE request to /my-route
    }
}

module.exports = new loginController();