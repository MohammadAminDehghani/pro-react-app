const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Article = require('app/models/article');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');
const path = require('path');
const bcrypt = require('bcrypt');
const faker = require('faker');

//const controller = require('./../../controllers/controller')


class homeController extends controller {
    async index(req, res) {
        //return res.json(6);
        const courses = await Course.find({}).sort({ createdAt: -1 }).limit(3).exec();
        const articles = await Article.find({}).sort({ createdAt: -1 }).limit(3).exec();
        //return res.json(courses);
        res.render('home/index', { courses, articles });
    }

    async coursePage(req, res) {

        // const addComment = new Comment({
        //     user : req.user.id,
        //     course : '64f8f91ffbb67894fb17f354',
        //     check : false,
        //     comment : faker.lorem.text()
        // });

        // addComment.save();

        const course = await Course.findOneAndUpdate({ _id: req.params.course }, { $inc: { viewCount: 1 } }).populate([
            { path: 'user', select: 'name' },
            { path: 'episodes' },
            {
                path: 'comments',
                match: { parent: null, check: true },
                populate: [
                    { path: 'user', select: 'name' },
                    {
                        path: 'comments',
                        match: { check: true },
                        populate: { path: 'user', select: 'name' }
                    }
                ]
            },

        ]).exec();

        const accessUser = await this.accessUser(req, course);
        res.render('home/page/coursePage', { req, course, accessUser });
    }

    async articlePage(req, res) {

        // const addComment = new Comment({
        //     user : req.user.id,
        //     article : '64f8f91ffbb67894fb17f354',
        //     check : false,
        //     comment : faker.lorem.text()
        // });

        // addComment.save();

        const article = await Article.findOneAndUpdate({ _id: req.params.article }, { $inc: { viewCount: 1 } })
            .populate([
                { path: 'user', select: 'name' },
                {
                    path: 'comments',
                    match: { parent: null, check: true },
                    populate: [
                        { path: 'user', select: 'name' },
                        {
                            path: 'comments',
                            match: { check: true },
                            populate: { path: 'user', select: 'name' }
                        }
                    ]
                },

            ]).exec();

        res.render('home/page/articlePage', { req, article });
    }

    async downloadEpisode(req, res, next) {
        const episode = await Episode.findById(req.params.id);
        if (!episode) return res.json('چنین ویدیویی برای دانلود وجود ندارد');
        if (!this.checkSecretUrl(req, res, episode)) return res.json('لینک دانلود معتبر نیست');
        episode.inc('downloadCount');
        const filePath = path.resolve(`./public/${episode.videoUrl}`);
        res.download(filePath)
    }

    checkSecretUrl(req, res, episode) {
        const time = new Date().getTime();
        if (req.query.t < time) return res.json('لینک دانلود منقضی شده است')
        const secret = `asdqwoidjopedm!@sdfwe#asd%${episode.id}${req.query.t}`;
        // console.log(secret)
        // console.log(req.query.secret)
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