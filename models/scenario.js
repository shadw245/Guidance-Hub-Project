 const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
    patterns: [String],
    reply: String
}, { collection: 'chatbot' });  

module.exports = mongoose.model('Scenario', scenarioSchema);