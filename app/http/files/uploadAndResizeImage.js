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
  
    // Normalize the subfolderPath to use forward slashes
    subfolderPath = subfolderPath.replace(/\\/g, '/');
  
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
        req.body.path = filePath;
        cb(null, file.originalname);
      } else {
        let now = Date.now();
        req.body.path = getDir() + '/' + now + '-' + file.originalname;
        cb(null, now + '-' + file.originalname);
      }
  
    }
  });
  const uploadAndResizeImage = multer({ storage: storage });


  module.exports = uploadAndResizeImage;
  