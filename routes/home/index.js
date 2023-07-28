const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home/index');
})

//logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.clearCookie('remember_token')
        res.redirect('/');
    });
})

module.exports = router