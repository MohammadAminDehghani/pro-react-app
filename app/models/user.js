const mongoose = require('mongoose');
const uniqueString = require('unique-string')
const bcrypt = require('bcrypt');

const mySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  rememberToken : { type: String, default : ''}
}, { timestamps: true });

mySchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    return next();
  } catch (err) {
    return next(err);
  }
});

mySchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error(err);
  }
}

mySchema.methods.setRememberToken = function() {
  const token = uniqueString();
  resizeBy.cookie('remember_token', token, { maxAge : 1000 * 60 , httpOnly: true, signed : true })
}

const User = mongoose.model('User', mySchema);

module.exports = User;