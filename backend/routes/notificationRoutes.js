const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all notifications for the current user
router.get('/', getNotifications);

// Mark a notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

module.exports = router; 