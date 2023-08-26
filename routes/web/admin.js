const express = require('express');
const router = express.Router();
const upload = require('app/http/files/uploadAndResizeImage');

//middleware
router.use((req, res, next) => {
  res.locals.layout = 'admin/master';
  next();
})

const attachFileToFormData = require('app/http/middleware/attachFileToFormData')


//controller
const adminController = require('app/http/controllers/admin/adminController')
const courseController = require('app/http/controllers/admin/courseController')

//validators
const courseValidator = require('app/http/validators/admin/courseValidator')


router.get('/', adminController.index);
// router.post('/login', loginValidator.handle(), loginController.post);



//courses routes
// Define routes for courses
router.get('/course', courseController.index);
router.get('/course/:id/show', courseController.show);

router.get('/course/create', courseController.create);
router.post('/course', upload.single('image'), attachFileToFormData.handle, courseValidator.handle(), courseController.post);

router.get('/course/:id/edit', courseController.edit);
router.put('/course/:id', upload.single('image'), attachFileToFormData.handle, courseValidator.handle(), courseController.update);

router.delete('/course/:id', courseController.delete);

module.exports = router