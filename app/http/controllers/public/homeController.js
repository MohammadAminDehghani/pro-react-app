const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const path = require('path');
const bcrypt = require('bcrypt');
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
        const auth = {
            check: req.isAuthenticated(),
        }
        //console.log(auth.check)
        //res.json(auth.check);
        const accessUser = await this.accessUser(req, course);
        res.render('home/page/coursePage', { req, course, accessUser, auth });
    }

    async downloadEpisode(req, res, next) {
        const episode = await Episode.findById(req.params.id);
        if (!episode) return res.json('چنین ویدیویی برای دانلود وجود ندارد');
        if (!this.checkSecretUrl(req, episode)) return res.json('لینک دانلود معتبر نیست');
        const filePath = path.resolve(`./public/${episode.videoUrl}`);
        res.download(filePath)
    }

    checkSecretUrl(req, episode) {
        const time = new Date().getTime();
        if (req.query.t < time) return res.json('لینک دانلود منقضی شده است')
        const secret = `asdqwoidjopedm!@sdfwe#asd%${episode.id}${req.query.t}`;
    console.log(secret)
    console.log(req.query.secret)
        return bcrypt.compareSync(secret, req.query.secret);
    }

    accessUser(req, course) {
        let access = false;
        if (req.isAuthenticated()) {
            switch (course.type) {
                case 'vip':
                    access = req.user.isVip();
                    break;
                case 'chash':
                    access = req.user.payCash(course);
                    break;
                default:
                    access = true;
                    break;
            }
        }
        return access;
    }
}

module.exports = new homeController();