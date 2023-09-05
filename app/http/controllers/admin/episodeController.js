const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const sprintf = require('sprintf-js').sprintf;

class episodeController extends controller {

    
    async index(req, res, next) {
        try {
            let page = req.query.page || 1;
            const episodes = await Episode.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate: 'course' });
            //return res.json(episodes)
            res.render('admin/episode/index', { episodes });
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        const courses = await Course.find({});
        
        res.render('admin/episode/create', { errors: req.flash('errors'), courses });
    }

    async edit(req, res, next) {
        const episode = await Episode.findById(req.params.id);
        const courses = await Course.find({});
        res.render('admin/episode/edit', { messages: req.flash('errors'), episode, courses });
    }

    async store(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async storeProcess(req, res, next) {
        try {
            //const addepisode = new Episode({ ...req.body });
            const addepisode = new Episode(req.body);
            //await addepisode.save();
            const newCourse = await addepisode.save();

            // update course time
            this.updateCourseTime(req.body.course);
            // update course time
            //this.updateCourseTime(episode.course);
            res.redirect('/admin/episode');
        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async updateProcess(req, res, next) {

        const episode = await Episode.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });

        // update course time
        this.updateCourseTime(episode.course);
        // update episode time
        //this.updateCourseTime(req.body.course);

        return res.redirect('/admin/episode');
    }

    async destroy(req, res, next) {
        // try {
        //     let episode = await Episode.findById(req.params.id);
        //     if ( ! episode) {
        //         this.error('چنین ویدیویی این دوره ثبت نشده است', 404);
        //     }
        //     // update course time
        //     this.updateCourseTime(episode.course);
        //     episode.remove();

        //     return res.redirect('/admin/episode');
        // } catch (err) {
        //     next(err)
        // }

        const episodeId = req.params.id;

        try {
            let episode = await Episode.findById(req.params.id);
            // update course time
            this.updateCourseTime(episode.course);
            const removedEpisode = await Episode.findByIdAndRemove(episodeId);
            if (removedEpisode) {
                return res.redirect('/admin/episode');
            } else {
                this.error('چنین ویدیویی این دوره ثبت نشده است', 404);
            }
        } catch (error) {
            res.status(500).json({ message: 'خطای سرور' });
        }
    }

    // async updateCourseTime(courseId) {
    //     const course = await Course.findById(courseId).populate('episodes').exec();
    //     course.set({ time: this.getTime(course.episodes) })
    //     await course.save();
    // }

    async updateCourseTime(courseId) {
        const episodes = await Episode.find({ course: courseId });
        await Course.findByIdAndUpdate(courseId, { time: this.getTime(episodes) });
    }

    getTime(episodes) {
        let totalSeconds = 0;

        episodes.forEach(episode => {
            const timeParts = episode.time.split(':');
            const numParts = timeParts.map(part => parseInt(part));

            let seconds = 0;
            if (numParts.length === 3) {
                seconds += numParts[0] * 3600; // hours to seconds
                seconds += numParts[1] * 60; // minutes to seconds
                seconds += numParts[2]; // seconds
            } else if (numParts.length === 2) {
                seconds += numParts[0] * 60; // minutes to seconds
                seconds += numParts[1]; // seconds
            } else if (numParts.length === 1) {
                seconds += numParts[0]; // seconds
            }

            totalSeconds += seconds;
        });

        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        // Format the time using sprintf
        const formattedTime = sprintf('%02d:%02d:%02d', hours, minutes, seconds);

        return formattedTime;
    }


}

module.exports = new episodeController();