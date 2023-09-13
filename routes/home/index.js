const express = require('express');
const router = express.Router();



// controllers
const homeController = require('app/http/controllers/public/homeController');
const commentController = require('app/http/controllers/admin/commentController');
const courseController = require('app/http/controllers/admin/courseController');
const articleController = require('app/http/controllers/admin/articleController');

router.get('/', homeController.index);

router.get('/course/:course', homeController.coursePage);
router.get('/download/:id', homeController.downloadEpisode);

//ثبت کامنت ها
router.post('/comment', commentController.comment);


// صفحه مقاله
router.get('/article/:article', homeController.articlePage);


router.get('/courses', courseController.allCourses);
router.get('/articles', articleController.allArticles);

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