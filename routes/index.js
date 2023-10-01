const express = require('express');
const router = express.Router();
const homeRoutes = require('./home/index')
const registerRoutes = require('./auth/register')
const loginRoutes = require('./auth/login')
const googleRoutes = require('./auth/google')
const forgetPasswordRoutes = require('./auth/forget-password')
const resetPasswordRoutes = require('./auth/reset-password')
const adminRoutes = require('./web/admin')

//middleware
const redirectAuthenticated = require('./../app/http/middleware/redirectAuthenticated');
const redirectAdmin = require('app/http/middleware/redirectAdmin');



router.use('/', homeRoutes)
router.use('/auth', redirectAuthenticated.handle, registerRoutes)
router.use('/auth', redirectAuthenticated.handle,  loginRoutes)
router.use('/auth', redirectAuthenticated.handle,  googleRoutes)
router.use('/auth', redirectAuthenticated.handle,  forgetPasswordRoutes)
router.use('/auth', redirectAuthenticated.handle,  resetPasswordRoutes)

router.use('/admin', redirectAdmin.handle,  adminRoutes)

module.exports = router