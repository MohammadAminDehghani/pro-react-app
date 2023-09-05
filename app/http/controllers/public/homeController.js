const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
//const controller = require('./../../controllers/controller')


class homeController extends controller {
    async index(req, res) {
        //return res.json(6);
        const courses = await Course.find({}).sort({ createdAt: 1 }).limit(6).exec();
        return res.json(courses);
        res.render('home/index', { courses });
    }
}

module.exports = new homeController();