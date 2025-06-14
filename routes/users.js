const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { requireAdmin } = require('../controllers/auth');

// List users
router.get('/', requireAdmin, userController.listUsers);
// Get single user
router.get('/:id', requireAdmin, userController.getUser);
// Add user
router.post('/', requireAdmin, userController.addUser);
// Update user
router.put('/:id', requireAdmin, userController.updateUser);
// Delete user
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;
