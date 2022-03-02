const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "Firstname is required"] },
  lastName: { type: String, required: [true, "Lastname is required"] },
  userName: { type: String, required: [true, "Username is required"] },
  email: {  type: String, required: [true, "email is required"],
     unique: [true, "This email has been used"],  },
  password: { type: String, required: [true, "Password is required"] },
});

module.exports = mongoose.model("User", userSchema);
