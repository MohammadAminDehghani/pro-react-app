const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePagination = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const Episode = mongoose.Schema({
    course : { type : Schema.Types.ObjectId , ref : 'Course'},
    number : { type : String , required : true },
    title : { type : String , required : true },
    body : { type : String , required : true },
    type : { type : String , required : true },
    time : { type : String , default : '00:00:00' },
    videoUrl : { type : String , required : true },
    downloadCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
    
} , {
    timestamps : true
})

Episode.plugin(mongoosePagination);
// Define a static method for pagination
// Episode.statics.paginate = async function (page, limit) {
//     const skip = (page - 1) * limit;
//     const countPromise = this.countDocuments().exec();
//     const docsPromise = this.find().skip(skip).limit(limit).exec();
//     return Promise.all([countPromise, docsPromise])
//       .then(([total, results]) => {
//         const totalPages = Math.ceil(total / limit);
//         return {
//           results,
//           page,
//           limit,
//           total,
//           totalPages
//         };
//       });
//   };

Episode.methods.download = function(check, user){
    let access = false;
    if(! check) return '#';
    if(this.type == 'free')
        access = true;
    else if(this.type == 'vip')
        access = user.isVip();
    else if(this.type == 'cash')
        access = user.checkpayCash(this.course)

    const time = new Date().getTime() + 1000 * 3600 * 24
    const secert = `asdqwoidjopedm!@sdfwe#asd%${this.id}${time}`;
    const salt =  bcrypt.genSaltSync(15);
    const hash =  bcrypt.hashSync(secert, salt);

    return access ? `/download/${this.id}?secret=${hash}&t=${time}` : '#';

}

Episode.methods.inc = async function(field, num = 1){
    this[field] += num;
    await this.save()
}

module.exports = mongoose.model('Episode' , Episode);