const middleware = require('app/http/middleware/middleware')

class checkError extends middleware {

    get404(req, res, next) {
        try {
            this.error('چنین صفحه ای وجود ندارد', 404)
        } catch (err) {
            next(err)
        }
    }

    handle(err, req, res, next) {
        let statusCode = err.statusCode || 500;
        let message = err.message || '';
        let stack = err.stack || '';

        if (config.debug) return res.render('error/stack', { statusCode, message, stack });
        return res.render(`error/${statusCode}`, { statusCode, message })
    }
}

module.exports = new checkError()