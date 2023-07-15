const { RecaptchaV2 } = require('express-recaptcha');
const autoBind = require('auto-bind');

module.exports = class controller {
    constructor() {
        autoBind(this);
        this.setRecaptcha();
    }

    setRecaptcha() {
        this.recaptcha = new RecaptchaV2('6Lf77BUnAAAAALeqaGqeEFyWMtntf9SocREluLuM', '6Lf77BUnAAAAAE655S7BwIGzjl-h2TQd5z0WuJwA', { 'hl': 'fa' });
    }

    validationRecaptcha(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (error) => {
                if (error) {
                    req.flash('errors', {
                        name: 'recaptcha',
                        message: 'تیک من ربات نیستم را بزنید '
                    });
                    res.redirect('/auth/register');
                } else {
                    resolve(true)
                }
            })
        })
    }
}