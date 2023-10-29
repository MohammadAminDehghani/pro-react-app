const User = require('app/models/user');
const controller = require('../controller');
const passport = require('passport');

class RegisterController extends controller {

    get(req, res) {
        res.render('auth/register', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }


    async post(req, res, next) {
        await this.validationRecaptcha(req, res)
            const result = await this.validationForm(req, res)

            if (result) {
                this.register(req, res, next)
            }

    }

    register(req, res, next) {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/auth/register',
            failureFlash: true
        })(req, res, next)
    }


    put(req, res) {
        // Handle PUT request to /my-route
    }

    delete(req, res) {
        // Handle DELETE request to /my-route
    }
}

module.exports = new RegisterController();