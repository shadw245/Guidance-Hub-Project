const mongoose = require('mongoose');

const mentorshipBookingSchema = new mongoose.Schema({
    mentorship: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Booked', enum: ['Booked', 'Cancelled'] },
    bookedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Ensure one booking per user per mentorship
mentorshipBookingSchema.index({ mentorship: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('MentorshipBooking', mentorshipBookingSchema);
