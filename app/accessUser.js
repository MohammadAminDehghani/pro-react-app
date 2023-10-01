var ConnectRoles = require('connect-roles');
const Permission = require('app/models/permission');

const user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (accept.indexOf('html')) {
            return res.json('access-denied');
        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

const permissions = async() => {
    return await Permission.find({}).populate('roles').exec();
}

permissions().
    then(permissions => {
        permissions.forEach(perm => {
            let roles = perm.roles.map(role =>role._id);
            user.use(perm.name, (req)=>{
                return req.user.hasRoles(roles) ? true : false;
            })
        });
    })

module.exports = user;