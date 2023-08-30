// const multer = require('multer');
// const fsExtra = require('fs-extra');
// const path = require('path');
// const fs = require('fs')

// const getDir = () => {
//     let uploadDir = 'public/uploads/';
//     let currentDate = new Date();
//     let year = currentDate.getFullYear().toString();
//     let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//     let day = currentDate.getDate().toString().padStart(2, '0');
//     let subfolderPath = path.join(uploadDir, year, month, day);

//     // Normalize the subfolderPath to use forward slashes
//     subfolderPath = subfolderPath.replace(/\\/g, '/');

//     return subfolderPath;
//   }

//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       let subfolderPath = getDir();
//       fsExtra.ensureDir(subfolderPath)
//         .then(() => {
//           cb(null, subfolderPath);
//         })
//         .catch(err => {
//           cb(err);
//         });
//     },
//     filename: function (req, file, cb) {
//       let filePath = getDir() + '/' + file.originalname
//       if (!fs.existsSync(filePath)) {
//         req.body.path = filePath;
//         cb(null, file.originalname);
//       } else {
//         let now = Date.now();
//         req.body.path = getDir() + '/' + now + '-' + file.originalname;
//         cb(null, now + '-' + file.originalname);
//       }

//     }
//   });
//   const uploadAndResizeImage = multer({ storage: storage });


//   module.exports = uploadAndResizeImage;


const multer = require('multer');
const fsExtra = require('fs-extra');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const getDir = () => {
  let uploadDir = 'public/uploads/';
  let currentDate = new Date();
  let year = currentDate.getFullYear().toString();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let day = currentDate.getDate().toString().padStart(2, '0');
  let subfolderPath = path.join(uploadDir, year, month, day);

  // Normalize the subfolderPath to use forward slashes
  subfolderPath = subfolderPath.replace(/\\/g, '/');

  return subfolderPath;
};

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
    let fileNameWithoutExt = path.parse(file.originalname).name;
    let fileExt = path.parse(file.originalname).ext;

    let filePath = getDir() + '/' + file.originalname;
    if (!fs.existsSync(filePath)) {
      req.body.path = filePath;
      cb(null, file.originalname);
    } else {
      let now = Date.now();
      req.body.path = getDir() + '/' + now + '-' + file.originalname;
      cb(null, now + '-' + file.originalname);
    }

    // Add image sizes to the image object
    const sizes = [360, 480, 720, 1080]; // Specify desired sizes here
    imageSizes = {};

    if (file) {
      imageSizes['original'] = getDir() + '/' + file.originalname;
      sizes.map(size => imageSizes[size] = getDir() + '/' + `${fileNameWithoutExt}_${size}${fileExt}`);

      Object.keys(imageSizes).forEach(function (key, index) {
        imageSizes[key] = imageSizes[key].substr(6);
      });
      req.body.image = file.originalname
      req.body.path = imageSizes;
    }


    // Add image sizes to the image object
    // const sizes = [360, 480, 720, 1080]; // Specify desired sizes here
    // req.body.image = {
    //   original: file.originalname,

    // sizes: sizes.map(size => ({
    //     size: size,
    //     path: `${fileNameWithoutExt}_${size}${fileExt}`,
    //   }))
    // };
  }
});

const upload = multer({ storage: storage });

const uploadAndResizeImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Handle upload error
      return next(err);
    }

    // Resize the uploaded image
    if (req.file) {
      const file = req.file;
      const sizes = [360, 480, 720, 1080]; // Specify desired sizes here

      sizes.forEach((size) => {
        const resizedFileName = getDir() + `/${path.parse(file.originalname).name}_${size}${path.parse(file.originalname).ext}`;

        sharp(file.path)
          .resize(size)
          .toFile(resizedFileName, (err) => {
            if (err) {
              console.error(err);
            } else {
              //console.log(`Image resized to ${size}px: ${resizedFileName}`);
            }
          });
      });
    }

    next();
  });
};

module.exports = uploadAndResizeImage;