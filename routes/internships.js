const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internship');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Please log in to access this feature' });
    }
    next();
};

// Middleware to check if user is instructor or admin
const requireInstructorOrAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Please log in to access this feature' });
    }
    if (!req.session.user.isInstructor && !req.session.user.isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. Instructor or admin role required.' });
    }
    next();
};

// Public routes - anyone can view internships
router.get('/', internshipController.getAllInternships);
// Admin/Instructor only routes
router.post('/add', requireInstructorOrAdmin, internshipController.addInternship);
router.delete('/delete/:internshipId', requireInstructorOrAdmin, internshipController.deleteInternship);

module.exports = router;
