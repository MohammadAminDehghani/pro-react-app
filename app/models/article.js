const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Article = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    slug: { type: String, default: '' },
    body: { type: String, required: true },
    image: { type: Object, required: true },
    tags: { type: String, default: null },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    categories : [{ type : Schema.Types.ObjectId , ref : 'Category'}],
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})


Article.plugin(mongoosePaginate);

Article.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'article'
})


Article.methods.path = function () {
    return `/article/${this.id}`;
}

Article.methods.inc = async function (field, num = 1) {
    this[field] += num;
    await this.save()
}

module.exports = mongoose.model('Article', Article);