import "dotenv/config";
import type { Request, Response } from 'express';
export declare const initiateKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateStoryKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyStoryKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateStoryEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyStoryEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateSiteKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifySiteKhalti: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateSiteEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifySiteEsewa: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPaymentHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllPaymentHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=paymentController.d.ts.map