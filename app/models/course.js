const mongoose = require('mongoose');
const mongoosePagination = require('mongoose-paginate');

const Course = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: false },
  type: { type: String, required: true },
  time: { type: String, default: '00:00:00' },
  price: { type: Number, required: true },
  image: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
});

Course.plugin(mongoosePagination);

// Define a static method for pagination
// courseSchema.statics.paginate = async function (page, limit) {
//   const skip = (page - 1) * limit;
//   const countPromise = this.countDocuments().exec();
//   const docsPromise = this.find().skip(skip).limit(limit).exec();
//   return Promise.all([countPromise, docsPromise])
//     .then(([total, results]) => {
//       const totalPages = Math.ceil(total / limit);
//       return {
//         results,
//         page,
//         limit,
//         total,
//         totalPages
//       };
//     });
// };

Course.virtual('episodes', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'course',
})

Course.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
})

Course.methods.path = function(){
  return `/course/${this.id}`;
}

module.exports = mongoose.model('Course', Course);