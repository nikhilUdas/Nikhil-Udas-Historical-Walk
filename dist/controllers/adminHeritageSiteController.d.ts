import type { Request, Response } from 'express';
import '../middleware/auth.js';
export declare const addHeritageSite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateHeritageSite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteHeritageSite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllHeritageSites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getHeritageSiteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getHeritageSiteImage: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=adminHeritageSiteController.d.ts.map