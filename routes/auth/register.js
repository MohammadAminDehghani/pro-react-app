const express = require('express');
const router = express.Router();

//controller
const registerController = require('../../app/http/controllers/auth/registerController')

//validators
const registerValidator = require('../../app/http/validators/registerValidator')


router.get('/register', registerController.get);
router.post('/register', registerValidator.handle(), registerController.post);
// router.put('/my-route', registerController.put);
// router.delete('/my-route', registerController.delete);



module.exports = router