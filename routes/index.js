const express = require('express');
const router = express.Router();
const homeRoutes = require('./home/index')
const registerRoutes = require('./auth/register')
const loginRoutes = require('./auth/login')

router.use('/', homeRoutes)
router.use('/auth', registerRoutes)
router.use('/auth', loginRoutes)

module.exports = router