const express = require('express');
const router = express.Router();
const Mentorship = require('../models/mentorships'); // adjust path as needed

router.get('/mentorships', async (req, res) => {
    try {
        const mentorships = await Mentorship.find();

        // Extract subMajors grouped by major
        const subMajors = {};
        mentorships.forEach(m => {
            if (!subMajors[m.major]) {
                subMajors[m.major] = new Set();
            }
            subMajors[m.major].add(m.subMajor);
        });

        // Convert Set to Array for each major
        for (let major in subMajors) {
            subMajors[major] = Array.from(subMajors[major]);
        }

        res.render('mentorships', {
            mentorships,
            subMajors
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving mentorships");
    }
});
