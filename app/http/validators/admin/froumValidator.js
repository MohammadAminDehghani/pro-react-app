const validator = require('app/http/validators/validator.js');
const { check } = require('express-validator');
const path = require('path');

class froumValidator extends validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 5 })
                .withMessage('عنوان انجمن نباید کمتر از 5 کارکتر باشد'),
            check('label')
                .not().isEmpty()
                .withMessage('توضیحات مربوط به انجمن را وارد نمایید')
        ]
    }
}

module.exports = new froumValidator();