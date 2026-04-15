import type { Request, Response } from "express";
export declare const getFullUrl: (req: Request, storedPath: string | null, dynamicUrl?: string) => string | null;
export declare const sendStoredFile: (res: Response, storedPath: string, notFoundMessage?: string) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=mediaPath.d.ts.map