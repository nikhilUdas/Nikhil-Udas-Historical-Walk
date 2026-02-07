import multer from 'multer';
export declare const upload: multer.Multer;
export declare const fileToBase64: (file: Express.Multer.File) => string;
export declare const base64ToBuffer: (base64String: string) => Buffer;
export declare const base64ToDataURL: (base64String: string, mimeType?: string) => string;
//# sourceMappingURL=fileUpload.d.ts.map