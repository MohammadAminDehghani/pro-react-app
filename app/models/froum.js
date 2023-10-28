const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Froum = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    title : { type : String, required : true},
    label : { type : String, required : true} 
    
} , {
    timestamps : true,
    toJSON : { virtuals : false}
})

Froum.virtual('questions', {
    ref : 'FroumQue',
    localField : '_id',
    foreignField : 'froum'
})


Froum.plugin(mongoosePaginate);

module.exports = mongoose.model('Froum' , Froum);