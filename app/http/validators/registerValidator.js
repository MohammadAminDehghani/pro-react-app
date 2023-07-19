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
                .isLength({min:5})
                .withMessage('رمز عبور نمیتواند کمتر از 5 حرف باشد لطفا آن را تغییر دهید'),
        ]
    }
}


module.exports = new registerValidator();