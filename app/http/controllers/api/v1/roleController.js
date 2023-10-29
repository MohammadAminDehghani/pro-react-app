const controller = require('app/http/controllers/controller');
const Permission = require('app/models/permission');
const Role = require('app/models/role');
class roleController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const roles = await Role.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate : { path : 'permissions'} });
        res.render('admin/role/index', { roles })

    }

    async create(req, res, next) {
        const permissions = await Permission.find({});
        res.render('admin/role/create' , { permissions });
    }

    async post(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد سطح دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async edit(req, res, next) {
        const role = await Role.findById(req.params.id);
        const permissions = await Permission.find({});
        res.render('admin/role/edit',  {  role, permissions });
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش سطح دسترسی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async destroy(req, res, next) {
        try {
            const roleId = req.params.id;

            const deletedRole = await Role.findByIdAndDelete(roleId);

            if (!deletedRole) {
                return res.status(404).json({ message: 'همچین سطح دسترسی وجود ندارد' });
            }

            res.redirect('/admin/role');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    storeProcess(req, res, next) {
        let { name, label, permissions } = req.body;
        const addrole = new Role({
            name,
            label,
            permissions
        })

        addrole.save();
        res.redirect('/admin/role');
    }

    async updateProcess(req, res, next) {

        let { name , label, permissions} = req.body;
        await Role.findByIdAndUpdate(req.params.id, { $set: { 
            name,
            label,
            permissions
         } });

        return res.redirect('/admin/role');
    }



}



module.exports = new roleController();