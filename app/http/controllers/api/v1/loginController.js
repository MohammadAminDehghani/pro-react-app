const controller = require('app/http/controllers/controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

    async login(req, res)  {

        //console.log(req.query.email)
        //return res.json(req.params.email)
        if (!req.query.email || !req.query.password){
            return res.json({
                data : {
                    message : 'فرمت اطلاعات ارسال شده صحیح نیست'
                },
                login : false,
                success : true,
            })
        }

        passport.authenticate('local.login', (err, user) => {
            if(!user) return res.json({
                data : {
                    message : 'چنین کاربری در سایت ثبت نام نکرده است'
                },
                login : false,
                success : true,
            })

            req.login(user, async err=>{
                if(err) return res.json({
                    data : {
                        message : 'اطلاعات ورود به سایت صحیح نیست'
                    },
                    login : false,
                    success : true,
                })

                const token = await jwt.sign({ id : req.user.id }, 'secretKey' , { expiresIn : 60 * 60 * 12 } )
                return res.json({
                    data : {
                        message : 'شما با موفقیت وارد شدید',
                        token : token
                    },
                    login : true,
                    success : true,
                }) 
            })
        })(req, res)
    }


    put(req, res) {
        // Handle PUT request to /my-route
    }

    delete(req, res) {
        // Handle DELETE request to /my-route
    }
}

module.exports = new loginController();