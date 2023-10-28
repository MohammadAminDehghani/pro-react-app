const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const FroumQue = mongoose.Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    froum : { type : Schema.Types.ObjectId, ref : 'Froum'},
    title : { type : String, required : true},
    body : { type : String, required : true},
    countAns : { type : Number, default : 0},
    countUser : { type : Number, default : 0}
    
} , {
    timestamps : true,
    toJSON : { virtuals : false}
})

FroumQue.plugin(mongoosePaginate);

FroumQue.methods.inc = async function(field, num = 1){
    this[field] += num;
    await this.save();
}

module.exports = mongoose.model('FroumQue' , FroumQue);