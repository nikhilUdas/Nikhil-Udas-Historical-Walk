import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: string;
                type: 'admin' | 'user';
            };
        }
    }
}
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuthenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map