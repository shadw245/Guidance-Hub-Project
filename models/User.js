const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  mobile: String,
  country: String,
  gender: String,
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Show this field if true in the UI
  isInstructor: { type: Boolean, default: false },
  appliedInternships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Internship" }],
  appliedMentorships: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentorship" }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;