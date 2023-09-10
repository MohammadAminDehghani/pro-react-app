const controller = require('app/http/controllers/controller');
const Comment = require('app/models/comment');
//const controller = require('./../../controllers/controller')


class commentController extends controller {
    async comment(req, res, next) {
        const addComment = new Comment({
            user : req.user.id,
            ...req.body
        })

        addComment.save();
        return this.back(req, res);
    }
}

module.exports = new commentController();