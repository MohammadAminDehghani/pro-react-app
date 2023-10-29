const express = require('express');
const router = express.Router();

const adminRoutes = require('routes/api/v1/admin')
const publicRoutes = require('routes/api/v1/public')

router.use('/api/v1/admin', adminRoutes);
router.use('/api/v1/public', publicRoutes);


module.exports = router