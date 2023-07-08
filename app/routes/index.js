const express = require('express');
const router = express.Router();
const homeRoutes = require('./home/index')
const registerRoutes = require('./auth/register')

router.use('/', homeRoutes)
router.use('/auth', registerRoutes)

module.exports = router