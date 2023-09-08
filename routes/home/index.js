const express = require('express');
const homeController = require('app/http/controllers/public/homeController');
const router = express.Router();


router.get('/', homeController.index);


router.get('/course/:course', homeController.coursePage);
router.get('/download/:id', homeController.downloadEpisode);

// router.get('/', (req, res) => {
//     res.render('home/index');
// })

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