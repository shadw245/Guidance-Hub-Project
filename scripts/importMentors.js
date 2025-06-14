const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Mentor = require('../models/Mentor');

async function importMentorData() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/Guidancehub');
        console.log('Connected to MongoDB');

        // Read the JSON file and normalize line endings
        const fileContent = fs.readFileSync(path.join(__dirname, '../data/mentor.json'), 'utf8')
            .replace(/^\uFEFF/, ''); // Remove BOM if present
        const jsonData = JSON.parse(fileContent);

        // Clear existing data
        await Mentor.deleteMany({});
        console.log('Cleared existing mentorship data');

        // Insert new data
        const result = await Mentor.insertMany(jsonData.mentorships);
        console.log(`Successfully imported ${result.length} mentorship records`);

        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}

importMentorData();