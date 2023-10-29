const controller = require('app/http/controllers/controller');
const Froum = require('app/models/froum');

class froumController extends controller {
    async index(req, res, next) {
        try {
            //const froums = await Froum.paginate({}, {limit : 10, sort : { createdAt : 1}, populate : { path : 'questions'}});
            const froums = await Froum.paginate({}, {limit : 10, sort : { createdAt : 1}});
            res.render('admin/froum/index', { froums })
        } catch (err) {
            next(err)
        }
    }

    async create(req, res, next) {
        res.render('admin/froum/create');
    }

    async post(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async edit(req, res, next) {
        const froum = await Froum.findById(req.params.id);
        res.render('admin/froum/edit', { froum });
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            this.back(req, res);
        }
    }

    async destroy(req, res, next) {
        try {
            const froumId = req.params.id;

            const deletedFroum = await Froum.findByIdAndDelete(froumId);

            if (!deletedFroum) {
                return res.status(404).json({ message: 'همچین انجمنی وجود ندارد' });
            }

            res.redirect('/admin/froum');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    }

    async storeProcess(req, res, next) {

        const addfroum = new Froum({
            user: req.user._id,
            ...req.body
        })

        await addfroum.save();
        res.redirect('/admin/froum');
    }

    async updateProcess(req, res, next) {

        await Froum.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });
        return res.redirect('/admin/froum');
    }


}



module.exports = new froumController();