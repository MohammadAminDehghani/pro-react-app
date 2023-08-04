const express = require('express');
const router = express.Router();

//middleware
router.use((req, res, next) => {
    res.locals.layout = 'admin/master';
    next();
})


// Middleware to set the layout based on the URL path
// router.use((req, res, next) => {
//     //console.log(req.path)
//     if (req.path.startsWith('/course')) {
//       res.locals.layout = 'admin/master';
//     } else {
//       res.locals.layout = 'default/master';
//     }
//     next();
//   });

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
router.post('/course', courseValidator.handle(), courseController.post);

router.get('/course/:id/edit', courseController.show);
router.put('/course/:id', courseValidator.handle(), courseController.update);

router.delete('/course/:id', courseController.delete);

module.exports = router