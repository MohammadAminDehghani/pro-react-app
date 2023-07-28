const express = require('express');
const router = express.Router();

//controller
const forgetPasswordController = require('../../app/http/controllers/auth/foregtPasswordController')

//validators
const forgetPasswordValidator = require('app/http/validators/forgetPasswordValidator')


router.get('/forget-password', forgetPasswordController.showForm);
router.post('/forget-password', forgetPasswordValidator.handle(), forgetPasswordController.passwordResetLink);

module.exports = router