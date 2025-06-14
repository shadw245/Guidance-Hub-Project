const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');
const mongoose = require('mongoose');

// Get all internships with user-specific application status
exports.getAllInternships = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected. Attempting to connect...');
            await mongoose.connect('mongodb://127.0.0.1:27017/Guidancehub');
        }

        // Get all internships
        const internships = await Internship.find({}).lean();
        
        // If user is logged in, get their applications
        let userApplications = [];
        if (req.session.user) {
            userApplications = await InternshipApplication.find({
                user: req.session.user._id,
                status: 'Applied'
            }).lean();
        }

        // Add user-specific status to each internship
        const internshipsWithStatus = internships.map(internship => {
            const userApplication = userApplications.find(app => 
                app.internship.toString() === internship._id.toString()
            );
            
            return {
                ...internship,
                userStatus: userApplication ? 'Applied' : 'Not Applied',
                userApplicationId: userApplication ? userApplication._id : null
            };
        });

        console.log('Found internships with user status:', internshipsWithStatus.length);

        // Render the view with internships
        return res.render('interships', { 
            internships: internshipsWithStatus,
            user: req.session.user 
        });
    } catch (error) {
        console.error('Error in getAllInternships:', error);
        return res.render('interships', { 
            internships: [],
            user: req.session.user,
            error: 'Failed to load internships'
        });
    }
};

// Add a new internship (instructor/admin only)
exports.addInternship = async (req, res) => {
    try {
        const { title, major, subMajor, requirements, description, duration, companyUrl } = req.body;

        // Validate required fields
        if (!title || !major || !subMajor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title, major, and subMajor are required' 
            });
        }

        // Create new internship
        const internship = new Internship({
            title,
            major,
            subMajor,
            requirements: requirements || '',
            description: description || '',
            duration: duration || '',
            companyUrl: companyUrl || '',
            status: 'Not Applied'
        });

        await internship.save();
        res.json({ success: true, internship });
    } catch (error) {
        console.error('Error in addInternship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete an internship (instructor/admin only)
exports.deleteInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;

        // Check if internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        // Check if there are any applications
        const applicationCount = await InternshipApplication.countDocuments({
            internship: internshipId,
            status: 'Applied'
        });

        if (applicationCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete internship. ${applicationCount} user(s) have applied for this internship.` 
            });
        }

        // Delete all withdrawn applications first
        await InternshipApplication.deleteMany({ internship: internshipId });
        
        // Delete the internship
        await Internship.findByIdAndDelete(internshipId);
        res.json({ success: true, message: 'Internship deleted successfully' });
    } catch (error) {
        console.error('Error in deleteInternship:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
