const express = require('express');
const router = express.Router();

//controller
const loginController = require('../../app/http/controllers/auth/loginController')

//validators
const loginValidator = require('../../app/http/validators/loginValidator')


router.get('/login', loginController.get);
router.post('/login', loginValidator.handle(), loginController.post);

module.exports = router

