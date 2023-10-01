const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' })

const path = require('path');


module.exports = class Helper {
    constructor(req, res) {
        autoBind(this);
        this.req = req;
        this.res = res;
    }

    Object() {
        return {
            auth: this.auth(),
            convertTime: this.convertTime,
            viewPath: this.viewPath,
            errors : this.req.flash('errors'),
            req: this.req,
        }
    }

    auth(req, res) {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user,
        }
    }

    convertTime(time) {
        return moment(time);
    }

    viewPath(dir) {
        return path.resolve(config.layout.VIEW_DIR + '/' + dir)
    }
}