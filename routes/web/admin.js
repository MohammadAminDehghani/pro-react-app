const express = require('express');
const router = express.Router();
const multer = require('multer');
const fsExtra = require('fs-extra');
const path = require('path');
const fs = require('fs')


const getDir = () => {
  let uploadDir = 'public/uploads/';
  let currentDate = new Date();
  let year = currentDate.getFullYear().toString();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let day = currentDate.getDate().toString().padStart(2, '0');
  let subfolderPath = path.join(uploadDir, year, month, day);
  return subfolderPath;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolderPath = getDir();
    fsExtra.ensureDir(subfolderPath)
      .then(() => {
        cb(null, subfolderPath);
      })
      .catch(err => {
        cb(err);
      });
  },
  filename: function (req, file, cb) {
    let filePath = getDir() + '/' + file.originalname
    if (!fs.existsSync(filePath)) {
      cb(null, file.originalname);
    } else {
      cb(null, Date.now() + '-' + file.originalname);
    }

  }
});
const upload = multer({ storage: storage });




//middleware
router.use((req, res, next) => {
  res.locals.layout = 'admin/master';
  next();
})

const attachFileToFormData = require('app/http/middleware/attachFileToFormData')


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
router.post('/course', upload.single('images'), attachFileToFormData.handle, courseValidator.handle(), courseController.post);

router.get('/course/:id/edit', courseController.show);
router.put('/course/:id', courseValidator.handle(), courseController.update);

router.delete('/course/:id', courseController.delete);

module.exports = router