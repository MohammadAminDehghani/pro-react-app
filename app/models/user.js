const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', mySchema);

module.exports = User;