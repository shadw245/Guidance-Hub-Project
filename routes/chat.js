const express = require('express');
const router = express.Router();
const Scenario = require('../models/scenario');

// GET route to render chatbot page
router.get('/', (req, res) => {
    res.render('chatbot'); // Ensure you have `views/chatbot.ejs`
});


router.post('/message', async (req, res) => {
    const { message } = req.body;
    const msg = message.trim().toLowerCase();

    try {
        const scenarios = await Scenario.find({});
        for (let scenario of scenarios) {
            for (let pattern of scenario.patterns) {
                if (msg.includes(pattern.toLowerCase())) {
                    return res.json({ reply: scenario.reply });
                }
            }
        }
        res.json({ reply: "Sorry, I didn't understand that. Can you rephrase your question?" });
    } catch (err) {
        console.error("Error reading chatbot data from DB:", err);
        res.status(500).json({ reply: "Something went wrong. Please try again later." });
    }
});

module.exports = router; 