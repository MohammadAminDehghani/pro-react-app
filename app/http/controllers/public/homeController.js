const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
//const controller = require('./../../controllers/controller')


class homeController extends controller {
    async index(req, res) {
        //return res.json(6);
        const courses = await Course.find({}).sort({ createdAt: -1 }).limit(3).exec();
        //return res.json(courses);
        res.render('home/index', { courses });
    }

    async coursePage(req, res) {
        const course = await Course.findById(req.params.course).populate('user').populate('episodes').exec();
        //console.log(req);
        //return res.json(course);
        res.render('home/page/coursePage', { course });
    }
}

module.exports = new homeController();