const express = require('express');
const router = express.Router();

//middleware
router.use((req, res, next) => {
    res.locals.layout = 'admin/master';
    next();
})

//controller
const adminController = require('../../app/http/controllers/admin/adminController')

//validators
//const loginValidator = require('../../app/http/validators/loginValidator')


router.get('/', adminController.index);
// router.post('/login', loginValidator.handle(), loginController.post);

module.exports = router