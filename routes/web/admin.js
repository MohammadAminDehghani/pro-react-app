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
const profileController = require('app/http/controllers/admin/profileController');
const permissionController = require('app/http/controllers/admin/permissionController');
const roleController = require('app/http/controllers/admin/roleController');
const userController = require('app/http/controllers/admin/userController');


//validators
const courseValidator = require('app/http/validators/admin/courseValidator');
const episodeValidator = require('app/http/validators/admin/episodeValidator');
const articleValidator = require('app/http/validators/admin/articleValidator');
const categoryValidator = require('app/http/validators/admin/categoryValidator');
const permissionValidator = require('app/http/validators/admin/permissionValidator');
const roleValidator = require('app/http/validators/admin/roleValidator');
const registerValidator = require('app/http/validators/registerValidator');


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


/////////////////////    profile routes   //////////////////////////////////
router.get('/profile', profileController.index);
router.put('/profile/:id', profileController.updateProfile);


/////////////////////    permission routes   //////////////////////////////////
router.get('/permission', permissionController.index);
//router.get('/permission/:id/show', permissionController.show);

router.get('/permission/create', permissionController.create);
router.post('/permission',  permissionValidator.handle(), permissionController.post);

router.get('/permission/:id/edit', permissionController.edit);
router.put('/permission/:id', permissionValidator.handle(), permissionController.update);

router.delete('/permission/:id', permissionController.destroy);


/////////////////////    role routes   //////////////////////////////////
router.get('/role', roleController.index);
//router.get('/role/:id/show', roleController.show);

router.get('/role/create', roleController.create);
router.post('/role',  roleValidator.handle(), roleController.post);

router.get('/role/:id/edit', roleController.edit);
router.put('/role/:id', roleValidator.handle(), roleController.update);

router.delete('/role/:id', roleController.destroy);

/////////////////////    user routes   //////////////////////////////////
router.get('/user', userController.index);
//router.get('/user/:id/show', userController.show);

router.get('/user/create', userController.create);
router.post('/user', registerValidator.handle(), userController.post);

router.get('/user/:id/edit', userController.edit);
router.put('/user/:id', registerValidator.handle(), userController.update);

router.delete('/user/:id', userController.destroy);

router.get('/user/:id/user-roles', userController.userRoles);
router.put('/user/:id/add-user-roles', userController.addUserRoles);
router.get('/user/:id/admin-access', userController.adminAccess);


module.exports = router