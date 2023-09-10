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


//validators
const courseValidator = require('app/http/validators/admin/courseValidator')
const episodeValidator = require('app/http/validators/admin/episodeValidator')


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


module.exports = router