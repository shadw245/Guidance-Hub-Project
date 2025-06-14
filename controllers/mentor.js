const Mentor = require('../models/Mentor');
const MentorshipBooking = require('../models/MentorshipBooking');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Get all mentorships with user-specific booking status
exports.getAllMentorships = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected. Attempting to connect...');
            await mongoose.connect('mongodb://127.0.0.1:27017/Guidancehub');
        }

        // Get all mentorships
        const mentorships = await Mentor.find({}).lean();
        
        // If user is logged in, get their bookings
        let userBookings = [];
        if (req.session.user) {
            userBookings = await MentorshipBooking.find({
                user: req.session.user._id,
                status: 'Booked'
            }).lean();
        }

        // Add user-specific status to each mentorship
        const mentorshipsWithStatus = mentorships.map(mentorship => {
            const userBooking = userBookings.find(booking => 
                booking.mentorship.toString() === mentorship._id.toString()
            );
            
            return {
                ...mentorship,
                userStatus: userBooking ? 'Booked' : 'Not Booked',
                userBookingId: userBooking ? userBooking._id : null
            };
        });

        console.log('Found mentorships with user status:', mentorshipsWithStatus.length);

        // Render the view with mentorships
        return res.render('mentorships', { 
            mentorships: mentorshipsWithStatus,
            user: req.session.user 
        });
    } catch (error) {
        console.error('Error in getAllMentorships:', error);
        return res.render('mentorships', { 
            mentorships: [],
            user: req.session.user,
            error: 'Failed to load mentorships'
        });
    }
};

// Book a mentorship
exports.bookMentorship = async (req, res) => {
    try {
        const { mentorshipId } = req.params;
        const userId = req.session.user._id;

        // Check if mentorship exists
        const mentorship = await Mentor.findById(mentorshipId);
        if (!mentorship) {
            return res.status(404).json({ success: false, message: 'Mentorship session not found' });
        }

        // Check if user has already booked this mentorship
        const existingBooking = await MentorshipBooking.findOne({
            mentorship: mentorshipId,
            user: userId,
            status: 'Booked'
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'You have already booked this mentorship session' });
        }

        // Create new booking
        const booking = new MentorshipBooking({
            mentorship: mentorshipId,
            user: userId,
            status: 'Booked'
        });

        await booking.save();
        res.json({ success: true, message: 'Mentorship booked successfully' });
    } catch (error) {
        console.error('Error in bookMentorship:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already booked this mentorship session' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Cancel a mentorship booking
exports.cancelMentorship = async (req, res) => {
    try {
        const { mentorshipId } = req.params;
        const userId = req.session.user._id;

        // Check if mentorship exists
        const mentorship = await Mentor.findById(mentorshipId);
        if (!mentorship) {
            return res.status(404).json({ success: false, message: 'Mentorship session not found' });
        }

        // Find user's booking for this mentorship
        const booking = await MentorshipBooking.findOne({
            mentorship: mentorshipId,
            user: userId,
            status: 'Booked'
        });

        if (!booking) {
            return res.status(403).json({ success: false, message: 'You have no active booking for this mentorship session' });
        }

        // Update booking status to Cancelled
        booking.status = 'Cancelled';
        await booking.save();

        res.json({ success: true, message: 'Mentorship booking cancelled successfully' });
    } catch (error) {
        console.error('Error in cancelMentorship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add a new mentorship (instructor only)
exports.addMentorship = async (req, res) => {
    try {
        const { title, major, subMajor, date, time } = req.body;

        // Validate required fields
        if (!title || !major || !subMajor || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required (title, major, subMajor, date, time)' 
            });
        }

        // Create mentorship object (removed status field)
        const mentorshipData = {
            title,
            major,
            subMajor,
            date,
            time
        };

        // Add file information if uploaded
        if (req.file) {
            mentorshipData.documentPath = req.file.path;
            mentorshipData.documentName = req.file.originalname;
        }

        // Create new mentorship
        const mentorship = new Mentor(mentorshipData);
        await mentorship.save();
        
        res.json({ success: true, mentorship });
    } catch (error) {
        console.error('Error in addMentorship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a mentorship (instructor only)
exports.deleteMentorship = async (req, res) => {
    try {
        const { mentorshipId } = req.params;

        // Check if mentorship exists
        const mentorship = await Mentor.findById(mentorshipId);
        if (!mentorship) {
            return res.status(404).json({ success: false, message: 'Mentorship session not found' });
        }

        // Check if there are any active bookings for this mentorship
        const activeBookings = await MentorshipBooking.find({
            mentorship: mentorshipId,
            status: 'Booked'
        });

        if (activeBookings.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete mentorship. ${activeBookings.length} active booking(s) exist. Please ask users to cancel their bookings first.` 
            });
        }

        // Delete associated file if exists
        if (mentorship.documentPath && fs.existsSync(mentorship.documentPath)) {
            try {
                fs.unlinkSync(mentorship.documentPath);
            } catch (fileError) {
                console.error('Error deleting file:', fileError);
                // Continue with mentorship deletion even if file deletion fails
            }
        }        // Delete all booking records for this mentorship (cancelled, withdrawn, etc.)
        await MentorshipBooking.deleteMany({ mentorship: mentorshipId });

        // Delete the mentorship
        await Mentor.findByIdAndDelete(mentorshipId);
        res.json({ success: true, message: 'Mentorship deleted successfully' });
    } catch (error) {
        console.error('Error in deleteMentorship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Edit a mentorship (admin/instructor only)
exports.editMentorship = async (req, res) => {
    try {
        const { mentorshipId } = req.params;
        const { title, major, subMajor, date, time } = req.body;

        // Validate required fields
        if (!title || !major || !subMajor || !date || !time) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required (title, major, subMajor, date, time)' 
            });
        }

        // Check if mentorship exists
        const mentorship = await Mentor.findById(mentorshipId);
        if (!mentorship) {
            return res.status(404).json({ success: false, message: 'Mentorship session not found' });
        }

        // Check if there are any active bookings for this mentorship
        const activeBookings = await MentorshipBooking.find({
            mentorship: mentorshipId,
            status: 'Booked'
        });

        if (activeBookings.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot edit mentorship. ${activeBookings.length} active booking(s) exist. Please ask users to cancel their bookings first.` 
            });
        }

        // Update mentorship
        const updatedMentorship = await Mentor.findByIdAndUpdate(
            mentorshipId,
            {
                title,
                major,
                subMajor,
                date,
                time
            },
            { new: true }
        );

        res.json({ success: true, mentorship: updatedMentorship });
    } catch (error) {
        console.error('Error in editMentorship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Download document for a mentorship
exports.downloadDocument = async (req, res) => {
    try {
        const { mentorshipId } = req.params;

        // Find the mentorship
        const mentorship = await Mentor.findById(mentorshipId);
        if (!mentorship) {
            return res.status(404).json({ success: false, message: 'Mentorship not found' });
        }

        // Check if document exists
        if (!mentorship.documentPath || !mentorship.documentName) {
            return res.status(404).json({ success: false, message: 'No document available for this mentorship' });
        }

        // Check if file exists on disk
        if (!fs.existsSync(mentorship.documentPath)) {
            return res.status(404).json({ success: false, message: 'Document file not found on server' });
        }

        // Set appropriate headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${mentorship.documentName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Send the file
        res.download(mentorship.documentPath, mentorship.documentName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({ success: false, message: 'Error downloading file' });
            }
        });
    } catch (error) {
        console.error('Error in downloadDocument:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};