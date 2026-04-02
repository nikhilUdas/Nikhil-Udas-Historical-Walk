import type { Request, Response } from 'express';
/**
 * Toggle favorite status for a heritage site
 */
export declare const toggleFavorite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get all favorite sites for the authenticated user
 */
export declare const getUserFavorites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=favoriteController.d.ts.map