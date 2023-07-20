const { RecaptchaV2 } = require('express-recaptcha');
const autoBind = require('auto-bind');
const { validationResult } = require('express-validator');
module.exports = class controller {
    constructor() {
        autoBind(this);
        this.setRecaptcha();
    }

    setRecaptcha() {
        console.log(process.env.DATABASE_URL)
        //console.log(config.database.url)
        //this.recaptcha = new RecaptchaV2(process.env.RECAPTCHA_SITEKEY, process.env.RECAPTCHA_SECRETKEY, { 'hl': 'fa' });
    }

    async validationRecaptcha(req, res) {
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

    async validationForm(req, res) {
        const result = await validationResult(req)
        if (!result.isEmpty()) {
            const errors = result.errors;
            const errorsForFront = [];

            errors.forEach((error) => {
                errorsForFront.push({
                    name: error.param,
                    message: error.msg
                });
            });

            req.flash('errors', errorsForFront);
            res.redirect('/auth/register');
            return false;
        } else {
            return true;
        }
            

    }
}