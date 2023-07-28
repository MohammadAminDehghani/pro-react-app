const express = require('express');
const router = express.Router();

//controller
const resetPasswordController = require('../../app/http/controllers/auth/resetPasswordController')

//validators
//const resetPasswordValidator = require('../../app/http/validators/resetPasswordValidator')


router.get('/reset-password', resetPasswordController.get);
router.post('/reset-password', resetPasswordController.post);

module.exports = router