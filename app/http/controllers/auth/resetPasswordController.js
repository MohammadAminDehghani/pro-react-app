const controller = require('../controller');
const passport = require('passport');

class resetPasswordController extends controller {

    get(req, res) {
        res.render('auth/reset-password', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }


    async post(req, res, next) {
        //
    }

}

module.exports = new resetPasswordController();