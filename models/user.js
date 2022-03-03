const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Firstname is required"] },
  lastName: { type: String, required: [true, "Lastname is required"] },
  userName: { type: String, required: [true, "Username is required"] },
  email: {  type: String, required: [true, "email is required"],
     unique: [true, "This email has been used"],  },
  password: { type: String, required: [true, "Password is required"] },
});




userSchema.pre('save', function(next){
  let user = this;
  if (!user.isModified('password'))
      return next();
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash;
    next();
  })
  .catch(err => next(error));
});


userSchema.methods.comparePassword = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
}

//collection name is stories in the database
module.exports = mongoose.model('User', userSchema);

