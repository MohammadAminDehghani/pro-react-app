const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: '00:00:00'
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});




// Define a static method for pagination
courseSchema.statics.paginate = async function (page, limit) {
  const skip = (page - 1) * limit;
  const countPromise = this.countDocuments().exec();
  const docsPromise = this.find().skip(skip).limit(limit).exec();
  return Promise.all([countPromise, docsPromise])
    .then(([total, results]) => {
      const totalPages = Math.ceil(total / limit);
      return {
        results,
        page,
        limit,
        total,
        totalPages
      };
    });
};

module.exports = mongoose.model('Course', courseSchema);