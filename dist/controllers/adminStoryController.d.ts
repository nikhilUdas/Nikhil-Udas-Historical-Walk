import type { Request, Response } from "express";
import "../middleware/auth.js";
export declare const addStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteStory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllStories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStoryById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminStoryController.d.ts.map