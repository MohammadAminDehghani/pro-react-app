const controller = require('app/http/controllers/controller');
const User = require('../../../models/user');
//const controller = require('./../../controllers/controller')


class adminController extends controller {
    async index(req, res, next) {
        
        res.render('admin/index')
    }
}

module.exports = new adminController();