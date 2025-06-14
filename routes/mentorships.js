const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentor');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow only certain file types
        const allowedTypes = /pdf|doc|docx|txt|png|jpg|jpeg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, TXT, PNG, JPG, JPEG files are allowed'));
        }
    }
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Middleware to check if user is an admin or instructor
const isAdminOrInstructor = (req, res, next) => {
    console.log('Session user:', req.session.user);
    console.log('User isAdmin:', req.session.user?.isAdmin);
    console.log('User isInstructor:', req.session.user?.isInstructor);
    
    if (!req.session.user) {
        return res.status(403).json({ success: false, message: 'Not logged in.' });
    }
    
    if (req.session.user.isAdmin === true || req.session.user.isInstructor === true) {
        console.log('Access granted');
        return next();
    }
    
    console.log('Access denied');
    return res.status(403).json({ success: false, message: 'Access denied. Instructors or Admins only.' });
};

// Get all mentorships
router.get('/', isLoggedIn, mentorController.getAllMentorships);

// Admin and Instructor routes
router.post('/add', [isLoggedIn, isAdminOrInstructor, upload.single('document')], mentorController.addMentorship);
router.delete('/:mentorshipId', [isLoggedIn, isAdminOrInstructor], mentorController.deleteMentorship);

// File download route
router.get('/download/:mentorshipId', isLoggedIn, mentorController.downloadDocument);

// Book a mentorship
router.post('/:mentorshipId/book', isLoggedIn, mentorController.bookMentorship);

// Cancel a mentorship
router.post('/:mentorshipId/cancel', isLoggedIn, mentorController.cancelMentorship);

module.exports = router;