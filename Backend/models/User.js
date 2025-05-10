const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // You should hash this before storing
  preference: { type: String },
  dob: { type: String },
  isAdmin:{
    type:Boolean,
    default:false,
  }
});

let User = mongoose.model("User", userSchema);

module.exports = User;
