import { Request, Response } from 'express';
export declare const getNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUnreadCount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markAsRead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markAllAsRead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAllNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createNotification: (userId: number, type: string, title: string, message: string, relatedId?: number) => Promise<{
    message: string;
    user_id: number;
    type: string;
    title: string;
    is_read: boolean;
    related_id: number | null;
    created_at: Date;
    notification_id: number;
}>;
//# sourceMappingURL=notificationController.d.ts.map