const controller = require('app/http/controllers/controller');
const User = require('../../../models/user');
//const controller = require('./../../controllers/controller')


class adminController extends controller {
    async index(req, res, next) {
        
        res.render('admin/index')
    }

    uploadImage(req, res, next) {
        let image = req.file;
        //console.log(image);
        res.json({
            "uploaded" : 1,
            "fileName" : image.originalname,
            "url" : `${image.destination}/${image.filename}`.substring(8)
        })
    }
}

module.exports = new adminController();