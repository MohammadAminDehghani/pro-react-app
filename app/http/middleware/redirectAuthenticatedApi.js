const middleware = require("app/http/middleware/middleware");
const passport = require("passport");

class redirectAuthenticatedApi extends middleware {
    handle(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user, message) => {
            if (err) {
                return res.json({
                    data: {
                        message: 'شما دسترسی لازم برای ورود نداری'
                    },
                    login: false,
                    success: true
                })
            }


            if (!user) {
                return res.json({
                    data: {
                        message: 'کاربری با این اطلاعات وجود ندارد'
                    },
                    login: false,
                    success: true
                })
            }


            next()
        })(req, res, next)
    }
}

module.exports = new redirectAuthenticatedApi();