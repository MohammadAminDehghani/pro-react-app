const controller = require('app/http/controllers/controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('app/models/user');

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

    async login(req, res) {

        //console.log(req.query.email)
        //return res.json(req.params.email)
        if (!req.query.email || !req.query.password) {
            return res.json({
                data: {
                    message: 'فرمت اطلاعات ارسال شده صحیح نیست'
                },
                login: false,
                success: true,
            })
        }

        passport.authenticate('local.login', { session: false }, (err, user) => {
            if (!user) return res.json({
                data: {
                    message: 'چنین کاربری در سایت ثبت نام نکرده است'
                },
                login: false,
                success: true,
            })

            req.login(user, async err => {
                if (err) return res.json({
                    data: {
                        message: 'اطلاعات ورود به سایت صحیح نیست'
                    },
                    login: false,
                    success: true,
                })

                const token = await jwt.sign({ _id: req.user.id }, config.jwt.secretKey, { expiresIn: 60 * 60 * 12 })
                return res.json({
                    data: {
                        message: 'شما با موفقیت وارد شدید',
                        token: token
                    },
                    login: true,
                    success: true,
                })
            })
        })(req, res)
    }

    async getUser(req, res) {
        // const decoded = jwt.verify(req.params.token, 'secretKey');
        //const user = await req.user.populate({ path : 'roles', select : 'name'}).exec();

        const user = await User.findById(req.user._id)
            .populate([
                { path: 'roles', select: 'name label', populate: [{ path: 'permissions', select: 'name label' }] },
                { path: 'payCash', populate: [{ path: 'categories' }] }
            ])
            .exec();

        return res.json({
            data: this.filterUserData(user),
            success: true
        })
    }

    filterUserData(user) {
        return {
            id : user.id,
            name : user.name,
            email : user.email,
            roles : user.roles.map(role => {
                return {
                    name : role.name,
                    label : role.label,
                    permissions : role.permissions.map(permission => {
                        return {
                            name : permission.name,
                            label : permission.label
                        }
                    })
                }
            }),
            createdAt : user.createdAt,
            updatedAt : user.updatedAt
        }
    }


    put(req, res) {
        // Handle PUT request to /my-route
    }

    delete(req, res) {
        // Handle DELETE request to /my-route
    }
}

module.exports = new loginController();