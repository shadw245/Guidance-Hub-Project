const User = require('../models/User');
const bcrypt = require('bcrypt');

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users, user: req.session.user });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ success: false, message: 'Error loading users' });
    }
};

// Get single user by ID
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
};

// Add new user
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, gender, role, isInstructor } = req.body;
        const hash = password ? await bcrypt.hash(password, 10) : undefined;
        const user = new User({
            name,
            email,
            password: hash,
            gender,
            isAdmin: role === 'admin',
            isInstructor: isInstructor === true || isInstructor === 'true'
        });
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, gender, role, isInstructor } = req.body;
        const update = {
            name,
            email,
            gender,
            isAdmin: role === 'admin',
            isInstructor: isInstructor === true || isInstructor === 'true'
        };
        
        if (password && password.trim() !== '') {
            update.password = await bcrypt.hash(password, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            update, 
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
