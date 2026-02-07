import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '../middleware/auth.js';
import prisma from '../models/index.js';
import os from 'os';

// Store active connections: userId -> socketId
const userSockets = new Map<number, string>();

export let io: SocketIOServer;

// Get local IP address
const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Initialize Socket.io
export const initializeSocket = (httpServer: any) => {
  const localIP = getLocalIP();
  
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [`http://localhost:3000`, `http://localhost:5173`, `http://localhost:8080`, `http://${localIP}:3000`, `http://${localIP}:5173`, `http://${localIP}:8080`], // Add your frontend URLs
      credentials: true,
    },
  });

  console.log(`\n🔌 Socket.io is running on ws://${localIP}:8000\n`);

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded: any = verifyToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    // Store the socket connection
    userSockets.set(userId, socket.id);

    // Send welcome message
    socket.emit('connected', { message: 'Connected to notification server', userId });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      userSockets.delete(userId);
    });

    // Handle custom events if needed
    socket.on('test', (data) => {
      console.log('Test message from user:', userId, data);
      socket.emit('test_response', { message: 'Test received', userId });
    });
  });

  return io;
};

// Emit notification to specific user
export const emitNotificationToUser = (userId: number, notification: any) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('new_notification', {
      notification,
      timestamp: new Date(),
    });
  }
};

// Broadcast notification to multiple users
export const broadcastNotificationToUsers = (userIds: number[], notification: any) => {
  userIds.forEach((userId) => {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
      io.to(socketId).emit('new_notification', {
        notification,
        timestamp: new Date(),
      });
    }
  });
};

// Broadcast to all connected users AND save to database for all users
export const broadcastNotificationToAll = async (notification: any) => {
  try {
    // Get all users from database
    const allUsers = await prisma.user.findMany({
      select: { user_id: true },
    });

    // Save notification to database for each user
    const notificationPromises = allUsers.map((user) =>
      prisma.notification.create({
        data: {
          user_id: user.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          related_id: notification.related_id || null,
        },
      })
    );

    await Promise.all(notificationPromises);

    // Emit real-time notification to all connected users
    if (io) {
      io.emit('new_notification', {
        notification,
        timestamp: new Date(),
      });
      console.log(`✅ Notification broadcast to all users: ${notification.title}`);
    }
  } catch (error) {
    console.error('Error broadcasting notification to all users:', error);
  }
};

// Get online users count
export const getOnlineUsersCount = (): number => {
  return userSockets.size;
};

// Check if user is online
export const isUserOnline = (userId: number): boolean => {
  return userSockets.has(userId);
};

// Get all online user IDs
export const getOnlineUsers = (): number[] => {
  return Array.from(userSockets.keys());
};
