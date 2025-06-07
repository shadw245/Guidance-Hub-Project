const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
  title: String,
  major: String,
  subMajor: String,
  date: String,
  time: String
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);
