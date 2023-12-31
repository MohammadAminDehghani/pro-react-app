const controller = require('app/http/controllers/controller');
const Comment = require('app/models/comment');
//const controller = require('./../../controllers/controller')


class commentController extends controller {
    async index(req, res, next) {
        const comments = await Comment.paginate(
            {},
            {
                limit: 25, sort: { createdAt: -1 },
                populate: [
                    {
                        path: 'user',
                        select: 'name'
                    },
                    'course',
                    'article',
                ]
            }
        );
        return res.render('admin/comment', { comments });
        return this.back(req, res);
    }

    async comment(req, res, next) {
        const addComment = new Comment({
            user: req.user.id,
            ...req.body
        })

        addComment.save();
        return this.back(req, res);
    }

    async destroy(req, res, next) {
        // const comment = await Comment.findById(req.params.id);
        // if (!comment) return res.json('چنین دیدگاهی در سیستم ثبت نشده است');

        // comment.comments.forEach(comment => comment.remove());
        // await comment.autoSection.inc('commentCount', -1);
        // return res.json(comment)
        // comment.remove();
        let comment = await Comment.findById(req.params.id);
        if (comment) {

            try {
                this.deleteCommentWithChildren(comment.id , res)
            } catch (error) {
                res.status(500).json({ message: 'خطای سرور' });
            }

            return res.redirect('/admin/comment');
        } else {
            this.error('چنین نظری ثبت نشده است', 404);
        }



        return this.back(req, res);
    }


    async deleteCommentWithChildren(commentId, res) {
        // Select the comment
        const comment = await Comment.findById(commentId).populate('autoSection').exec();

        // Find all child comments with the deleted comment as the parent
        const childComments = await Comment.find({ parent: commentId }); 

        // Recursively delete each child comment
        for (const childComment of childComments) {
            await this.deleteCommentWithChildren(childComment._id);
        }

        comment.autoSection.inc('commentCount', -(childComments.length+1));
        comment.save();

        await Comment.findByIdAndDelete(commentId);
    }

    async update(req, res, next) {
        const comment = await Comment.findById(req.params.id).populate('autoSection').exec();
        if (!comment) return res.json('چنین دیدگاهی در سیستم ثبت نشده است');

        comment.check = true;
        comment.autoSection.inc('commentCount');
        comment.save();
        return this.back(req, res);
    }

}

module.exports = new commentController();