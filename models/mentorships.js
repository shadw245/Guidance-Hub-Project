
const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    major: String,
    subMajor: String,
    status: String
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);

