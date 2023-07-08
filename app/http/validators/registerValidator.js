const {check} = require('express-validator');

class registerValidator {
    handle() {
        return[
            check('name')
                .isLength({min:3})
                .withMessage('نام نمی تواند کمتر از 3 حرف باشد'),

            check('email')
                .isEmail()
                .withMessage('فرمت ایمیل معتبر نیست. از فرمت صحیح استفاده کنید'),
          
            check('password')
                .isStrongPassword()
                .withMessage('رمز عبور به اندازه کافی قوی نیست لطفا آن را تغییر دهید'),
        ]
    }
}


module.exports = new registerValidator();