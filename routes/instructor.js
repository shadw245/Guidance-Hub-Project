const express = require('express');
const router = express.Router();
exports.router = router;
const Mentorship = require('../models/mentorships');
const{requireInstructor} = require('../middleware/isInstructor');

// Show all mentorships (with CRUD buttons)
router.get('/mentorships', requireInstructor, async (req, res) => {
    const mentorships = await Mentorship.find();
    res.render("../views/Instructor/instructor-mentorships", { mentorships });
});

// Show form to add mentorship
router.get('/mentorships/new', requireInstructor, (req, res) => {
    res.render('../views/Instructor/mentorships-form', { mentorship: {}, action: 'Create' });
});

// Create mentorship
router.post('/mentorships', requireInstructor, async (req, res) => {
    await Mentorship.create(req.body);
    res.redirect('/instructor/mentorships');
});

// Update mentorship
router.post('/mentorships/:id', requireInstructor, async (req, res) => {
    await Mentorship.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/instructor/mentorships');
});

// Delete mentorship
router.post('/mentorships/:id/delete', requireInstructor, async (req, res) => {
    await Mentorship.findByIdAndDelete(req.params.id);
    res.redirect('/instructor/mentorships');
});
// Show form to edit mentorship
router.get('/mentorships/:id/edit', requireInstructor, async (req, res) => {
    const mentorship = await Mentorship.findById(req.params.id);
    res.render('mentorship-form', { mentorship, action: 'Edit' });
});


module.exports = router;