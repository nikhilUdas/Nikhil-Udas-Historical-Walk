import { Request, Response } from 'express';
import prisma from '../models/index.js';
import { emitNotificationToUser } from '../services/socketService.js';

// Get all notifications for a user
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const unreadCount = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });

    return res.status(200).json({ unreadCount });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { notification_id: parseInt(notificationId) },
    });

    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { notification_id: parseInt(notificationId) },
      data: { is_read: true },
    });

    return res.status(200).json({
      message: 'Notification marked as read',
      notification: updatedNotification,
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'Error marking all notifications as read', error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { notification_id: parseInt(notificationId) },
    });

    if (!notification || notification.user_id !== userId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { notification_id: parseInt(notificationId) },
    });

    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Delete all notifications for a user
export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await prisma.notification.deleteMany({
      where: { user_id: userId },
    });

    return res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting all notifications:', error);
    return res.status(500).json({ message: 'Error deleting all notifications', error: error.message });
  }
};

// Internal function to create notification (called by other services)
export const createNotification = async (
  userId: number,
  type: string,
  title: string,
  message: string,
  relatedId?: number
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId || null,
      },
    });

    // Emit real-time notification via Socket.io
    emitNotificationToUser(userId, notification);

    return notification;
  } catch (error: any) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
