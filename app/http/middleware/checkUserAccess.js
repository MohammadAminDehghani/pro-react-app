const middleware = require('app/http/middleware/middleware');
const Permission = require('app/models/permission');

class checkUserAccess extends middleware {
    check(permission) {
        return async (req, res, next) => {
            //return res.json(permission);
            const permissions = await Permission.find({ name: permission }).populate('roles').exec();
            //return res.json(permissions);
            permissions.forEach(perm => {
                let roles = perm.roles.map(role => role._id)
                return req.user.hasRoles(roles) ? next() : res.redirect('/admin')
            })
        }

    }
}

module.exports = new checkUserAccess();