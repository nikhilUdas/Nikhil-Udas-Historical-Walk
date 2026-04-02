import type { Request, Response } from 'express';
import '../middleware/auth.js';
export declare const addMuseum: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateMuseum: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteMuseum: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllMuseums: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMuseumById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMuseumImage: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const purchaseTicket: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserTickets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTicketById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=museumController.d.ts.map