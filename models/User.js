const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  mobile: String,
  country: String,
  gender: String,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isInstructor: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
