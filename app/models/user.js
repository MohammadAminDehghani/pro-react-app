const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema;

const User = mongoose.Schema({
  admin: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  rememberToken: { type: String, default: '' },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  payCash: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
},
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

User.pre('save', async function (next) {
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

User.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error(err);
  }
}

//const User = mongoose.model('User', mySchema);

User.methods.setRememberToken = function (res) {
  const token = uniqueString();
  res.cookie('remember_token', token, { maxAge: 1000 * 60, httpOnly: true, signed: true })
  this.updateOne({ rememberToken: token }
    //   , err => {
    //   if (err) console.log(err)
    // }
  )
}

User.methods.hasRoles = function (roles) {
  let result = roles.filter(role => {
    return this.roles.indexOf(role) > -1;
  })

  return !!result.length;
}

User.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'user',
})

User.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'user',
})

User.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
})

// User.virtual('roles', {
//   ref: 'User',
//   localField: '_id',
//   foreignField: 'roles',
// })

User.methods.isVip = function () {
  return false;
}

User.methods.payCashCheck = function (courseId) {
  //return true;
  return this.payCash.indexOf(courseId) !== -1;
}

User.plugin(mongoosePaginate);

module.exports = mongoose.model('User', User);
//module.exports = User;