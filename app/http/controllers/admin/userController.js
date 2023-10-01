const controller = require('app/http/controllers/controller');
const User = require('app/models/user');
const Role = require('app/models/role');
class userController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const users = await User.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate : { path : 'roles'} });
        res.render('admin/user/index', { users })
    }

    async create(req, res, next) {
        return res.render('admin/user/create');
    }

    async post(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد کاربر جدید درحال حاظر وجود ندارد')
            return this.back(req, res);
        }
    }

    async edit(req, res, next) {
        const user = await User.findById(req.params.id);
        res.render('admin/user/edit',  {  user });
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش کاربر درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async destroy(req, res, next) {
        try {
            const userId = req.params.id;

            const deletedUser = await User.findByIdAndDelete(userId);

            if (!deletedUser) {
                return res.status(404).json({ message: 'همچین سطح دسترسی وجود ندارد' });
            }

            res.redirect('/admin/user');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    storeProcess(req, res, next) {
        let { name, email, password } = req.body;
        const adduser = new User({
            name,
            email,
            password
        })

        adduser.save();
        return res.redirect('/admin/user');
    }

    async updateProcess(req, res, next) {

        let { name, email, password } = req.body;
        await User.findByIdAndUpdate(req.params.id, { $set: { 
            name,
            email,
            password
         } });

        return res.redirect('/admin/user');
    }

    async userRoles(req, res, next) {
        const user = await User.findById(req.params.id);
        const roles = await Role.find({});

        res.render('admin/user/userRole' , { user, roles });
    }

    async addUserRoles(req, res, next) {
        await User.updateOne({ '_id' : req.params.id} , { $set : { roles : req.body.roles ?? [] }});
        return res.redirect('/admin/user');
    }

    // تبدیل کاربر به مدیر و کاربر عادی
    async adminAccess(req, res, next) {
        //return res.json({ '_id' : req.params.id});
        const user = await User.findById(req.params.id);
        let roles = user.roles;
        if (user.admin === true) roles = [];
        await User.updateOne({ '_id' : req.params.id } , {$set : { admin : ! user.admin, roles : roles }});
        return res.redirect('/admin/user');
    }

}



module.exports = new userController();