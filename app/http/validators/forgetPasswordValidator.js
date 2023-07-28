const {check} = require('express-validator');

class forgetPasswordValidator {
    handle() {
        return[
            check('email')
                .isEmail()
                .withMessage('فرمت ایمیل معتبر نیست. از فرمت صحیح استفاده کنید'),
        ]
    }
}


module.exports = new forgetPasswordValidator();