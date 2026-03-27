import { Server as SocketIOServer } from 'socket.io';
export declare let io: SocketIOServer;
export declare const initializeSocket: (httpServer: any) => SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const emitNotificationToUser: (userId: number, notification: any) => void;
export declare const broadcastNotificationToUsers: (userIds: number[], notification: any) => void;
export declare const broadcastNotificationToAll: (notification: any) => Promise<void>;
export declare const getOnlineUsersCount: () => number;
export declare const isUserOnline: (userId: number) => boolean;
export declare const getOnlineUsers: () => number[];
//# sourceMappingURL=socketService.d.ts.map