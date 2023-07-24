const {check} = require('express-validator');

class loginValidator {
    handle() {
        return[
            check('email')
                .isEmail()
                .withMessage('فرمت ایمیل معتبر نیست. از فرمت صحیح استفاده کنید'),
          
            check('password')
                .isLength({min:5})
                .withMessage('رمز عبور نمیتواند کمتر از 5 حرف باشد لطفا آن را تغییر دهید'),
        ]
    }
}


module.exports = new loginValidator();