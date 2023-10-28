const autoBind = require('auto-bind');
const { RecaptchaV2 } = require('express-recaptcha');
const { validationResult } = require('express-validator');
module.exports = class controller {
    constructor() {
        autoBind(this);
        this.setRecaptcha();
    }

    setRecaptcha() {
        //console.log(process.env.RECAPTCHA_SITE_KEY);
        //console.log(process.env.RECAPTCHA_SECRET_KEY);
        //console.log(config.service.RECAPTCHA.SITE_KEY)
        this.recaptcha = new RecaptchaV2(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { 'hl': 'fa' });
    }

    async validationRecaptcha(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (error) => {
                if (error) {
                    req.flash('errors', {
                        name: 'recaptcha',
                        message: 'تیک من ربات نیستم را بزنید '
                    });
                    //res.redirect('/auth/register');
                    res.redirect(req.headers.referer);
                } else {
                    resolve(true)
                }
            })
        })
    }

    back(req, res) {
        if (!res.headersSent) {
            return res.redirect(req.header('Referer') || '/');
        } else {
            // Handle the case when headers have already been sent
            // You can choose to log an error, render an error page, or perform any other necessary action.
            console.error('Headers have already been sent. Unable to perform redirect.');
        }
    }

    async validationForm(req, res) {
        // const result = await validationResult(req)
        // if (!result.isEmpty()) {
        //     const errors = result.errors;
        //     const errorsForFront = [];

        //     errors.forEach((error) => {
        //         errorsForFront.push({
        //             name: error.param,
        //             message: error.msg
        //         });
        //     });
        //     req.flash('errors', errorsForFront);
        //     this.back(req, res);
        // } else {
        //     return true;
        // }

        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            //const errors = result.errors;
            const errorsForFront = [];
            errors.forEach((error) => {
                errorsForFront.push({
                    name: error.param,
                    message: error.msg
                });
            });
            req.flash('errors', errorsForFront);
            return false
        }

        return true;


    }
    
    alert(req, data) {
        let title = data.title,
            text = data.text,
            type = data.type

        req.flash('sweetalert' , { title, text, type})
    }
}