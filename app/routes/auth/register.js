const express = require('express');
const router = express.Router();

//controller
const registerController = require('./../../http/controllers/auth/register')

//validators
const registerValidator = require('./../../http/validators/registerValidator')


router.get('/register', registerController.get);
router.post('/register', registerValidator.handle(), registerController.post);
// router.put('/my-route', registerController.put);
// router.delete('/my-route', registerController.delete);



module.exports = router