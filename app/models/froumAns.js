const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const froumAns = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    question : { type : Schema.Types.ObjectId, ref : 'FroumQue'},
    body : { type : String, required : true},
    
} , {
    timestamps : true,
    toJSON : { virtuals : false}
})

froumAns.plugin(mongoosePaginate);

module.exports = mongoose.model('froumAns' , froumAns);