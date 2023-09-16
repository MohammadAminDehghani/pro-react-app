const controller = require('app/http/controllers/controller');
const Permission = require('app/models/permission');
class permissionController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const permissions = await Permission.paginate({}, { page, limit: 10, sort: { createAt: 1 } });
        res.render('admin/permission/index', { permissions })

    }

    async create(req, res, next) {
        res.render('admin/permission/create');
    }

    async post(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async edit(req, res, next) {
        const permission = await Permission.findById(req.params.id);
        res.render('admin/permission/edit', { permission });
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async destroy(req, res, next) {
        try {
            const permissionId = req.params.id;

            const deletedPermission = await Permission.findByIdAndDelete(permissionId);

            if (!deletedPermission) {
                return res.status(404).json({ message: 'همچین سطح دسترسی وجود ندارد' });
            }

            res.redirect('/admin/permission');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    storeProcess(req, res, next) {
        let { name, label } = req.body;
        const addpermission = new Permission({
            name,
            label
        })

        addpermission.save();
        res.redirect('/admin/permission');
    }

    async updateProcess(req, res, next) {

        let { name, label } = req.body;
        await Permission.findByIdAndUpdate(req.params.id, {
            $set: {
                name,
                label
            }
        });

        return res.redirect('/admin/permission');
    }



}



module.exports = new permissionController();