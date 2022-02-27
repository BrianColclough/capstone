const mongoose = require('mongoose');
const userSchema = new Schema({
    firstName: {type: String, required: [true, 'First name is required']},
    lastName: {type: String, required: [true, 'Last name is required']},
    email: { type: String, required: [true, 'Email address is required'], 
             unique: [true, 'This email address has been used'] },
    username: {type: String, required: [true, 'username is required']},
    password: { type: String, required: [true, 'Password is required'] },
    pswrepeat: { type: String, required: [true, 'Password is required'] },
}

);
module.exports = mongoose.model('User', userSchema);