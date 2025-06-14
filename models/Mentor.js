const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    title: String,
    major: { type: mongoose.Schema.Types.ObjectId, ref: 'Major', required: true },
    subMajor: {
        type: String,
        required: true,
        validate: {
            validator: async function (value) {
                const major = await mongoose.model('Major').findById(this.major);
                return major && major.submajors.some(sub => sub.name === value);
            },
            message: props => `${props.value} is not a valid submajor for the selected major`
        }
    },

    date: {type: Date},
    documentPath: { type: String, default: null }, // Path to uploaded document
    documentName: { type: String, default: null }  // Original filename
}, {
    timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);