const controller = require('app/http/controllers/controller')
const User = require('app/models/user');
const passwordReset = require('app/models/password-reset');
const uniqueString = require('unique-string')
const nodemailer = require('nodemailer');
class forgetpasswordController extends controller {

    showForm(req, res, next) {
        res.render('auth/forget-password', { errors: req.flash('errors'), success: req.flash('success'), recaptcha: this.recaptcha.render() })
    }

    async passwordResetLink(req, res, next) {
        await this.validationRecaptcha(req, res);
        let result = await this.validationForm(req);
        if (result) return this.resetLinkProcess(req, res, next);
        else
            res.redirect('/auth/password/reset')
    }

    async resetLinkProcess(req, res, next) {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('errors', 'کاربری با این ایمیل در سایت ثبت نام نکرده است')
            return this.back(req, res);
        }

        const setpassowrd = new passwordReset({
            email: req.body.email,
            token: uniqueString()
        })
        // await setpassowrd.save(err => {
        //     console.log(err)
        // })
        await setpassowrd.save().catch(err => {
            console.log(err);
        });

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'man.dehghani1991@gamil.com', // generated ethereal user
                pass: '8822318Amin@' // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"man.dehghani1991@gamil.com', // sender address
            to: `${setpassowrd.email}`, // list of receivers
            subject: 'تغییر رمز عبور✔', // Subject line
            text: 'از طریق لینک زیر می توانید رمز عبور خود را تغییر دهید', // plain text body
            html: `
                <h1>لینک تغییر رمز عبور</h1>
                <a href="http://localhost:3000/auth/password/reset/${setpassowrd.token}">برای تغییر رمز روی لینک کلیک کنید</a>
            ` // html body
        });

        transporter.sendMail(info, (err, data) => { 
            if(err) console.log(err.message); 

            this.alert(req, { 
                type : 'success',
                title : 'تغییر رمز عبور', 
                text : 'لیمک تغییر رمز عبور به ایملیتان ارسال شد' 
            })

            res.redirect('/auth/password/reset');  

        }) 
    }
}

module.exports = new forgetpasswordController();