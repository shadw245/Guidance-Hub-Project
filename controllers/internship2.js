// Apply for an internship
exports.applyInternship = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const userId = req.session.user._id;

        // Check if internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }

        // Check if user has already applied
        const existingApplication = await InternshipApplication.findOne({
            internship: internshipId,
            user: userId,
            status: 'Applied'
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
        }

        // Create new application
        const application = new InternshipApplication({
            internship: internshipId,
            user: userId,
            status: 'Applied'
        });

        await application.save();
        res.json({ success: true, message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error in applyInternship:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied for this internship' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
}; 


// Cancel internship application
exports.cancelApplication = async (req, res) => {
    try {
        const { internshipId } = req.params;
        const userId = req.session.user._id;

        // Find and update the application
        const application = await InternshipApplication.findOne({
            internship: internshipId,
            user: userId,
            status: 'Applied'
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'No application found for this internship' });
        }
    } catch (error) {
        console.error('Error in cancelApplication:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
