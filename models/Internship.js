const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
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
    requirements: String,
    description: String,
    duration: String,
    companyUrl: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);