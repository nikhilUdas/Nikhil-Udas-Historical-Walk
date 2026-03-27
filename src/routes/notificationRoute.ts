import express from 'express';
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)

// Get all notifications for the user
router.get('/getNotification', authenticate, getNotifications);

// Get unread notification count
router.get('/unread/count', authenticate, getUnreadCount);

// Mark all notifications as read
router.put('/read/all', authenticate, markAllAsRead);

// Mark specific notification as read
router.put('/:notificationId/read', authenticate, markAsRead);

// Delete all notifications
router.delete('/all', authenticate, deleteAllNotifications);

// Delete specific notification
router.delete('/:notificationId', authenticate, deleteNotification);

export default router;
