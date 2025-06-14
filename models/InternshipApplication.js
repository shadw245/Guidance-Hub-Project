const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Applied', enum: ['Applied', 'Withdrawn'] },
    appliedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Ensure one application per user per internship
internshipApplicationSchema.index({ internship: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
