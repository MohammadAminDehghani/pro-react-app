const controller = require('app/http/controllers/controller')
//const controller = require('./../../controllers/controller')


class adminController extends controller {
    index(req, res, next){
        res.render('admin/index')
    }
}

module.exports = new adminController();