const express = require('express');
const router = express.Router();
const upload = require('app/http/files/uploadAndResizeImage');

//middleware
router.use((req, res, next) => {
  res.locals.layout = 'admin/master';
  next();
})

const attachFileToFormData = require('app/http/middleware/attachFileToFormData');


//controller
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const episodeController = require('app/http/controllers/admin/episodeController');
const commentController = require('app/http/controllers/admin/commentController');
const articleController = require('app/http/controllers/admin/articleController');
const categoryController = require('app/http/controllers/admin/categoryController');


//validators
const courseValidator = require('app/http/validators/admin/courseValidator')
const episodeValidator = require('app/http/validators/admin/episodeValidator')
const articleValidator = require('app/http/validators/admin/articleValidator')
const categoryValidator = require('app/http/validators/admin/categoryValidator')


router.get('/', adminController.index);
// router.post('/login', loginValidator.handle(), loginController.post);



/////////////////////    course routes   //////////////////////////////////
router.get('/course', courseController.index);
router.get('/course/:id/show', courseController.show);

router.get('/course/create', courseController.create);
router.post('/course', upload,  courseValidator.handle(), courseController.post);

router.get('/course/:id/edit', courseController.edit);
router.put('/course/:id', upload, courseValidator.handle(), courseController.update);

router.delete('/course/:id', courseController.delete);


/////////////////////    episode routes   //////////////////////////////////
router.get('/episode', episodeController.index);
router.get('/episode/create', episodeController.create);
router.post('/episode/create', episodeValidator.handle(), episodeController.store);

//edit episode
router.get('/episode/:id/edit', episodeController.edit);
router.put('/episode/:id', episodeValidator.handle(), episodeController.update);

// delete episode
router.delete('/episode/:id', episodeController.destroy);


/////////////////////    comment routes   //////////////////////////////////
router.get('/comment', commentController.index);
router.delete('/comment/:id', commentController.destroy);
router.put('/comment/:id/approve', commentController.update);



/////////////////////    article routes   //////////////////////////////////
router.get('/article', articleController.index);
router.get('/article/:id/show', articleController.show);

router.get('/article/create', articleController.create);
router.post('/article', upload,  articleValidator.handle(), articleController.post);

router.get('/article/:id/edit', articleController.edit);
router.put('/article/:id', upload, articleValidator.handle(), articleController.update);

router.delete('/article/:id', articleController.delete);


/////////////////////    article routes   //////////////////////////////////
router.get('/category', categoryController.index);
//router.get('/category/:id/show', categoryController.show);

router.get('/category/create', categoryController.create);
router.post('/category',  categoryValidator.handle(), categoryController.post);

router.get('/category/:id/edit', categoryController.edit);
router.put('/category/:id', categoryValidator.handle(), categoryController.update);

router.delete('/category/:id', categoryController.destroy);

module.exports = router