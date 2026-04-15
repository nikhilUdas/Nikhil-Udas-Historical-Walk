import multer from "multer";
export declare const ensureDirectory: (dirPath: string) => void;
export declare const initializeUploadDirectories: () => void;
export declare const upload: multer.Multer;
/**
 * Converts a file buffer to a compressed Base64 Data URI string.
 * Resizes to max 1024px width/height and reduces quality to 80%.
 */
export declare const fileToBase64: (file: Express.Multer.File) => Promise<string>;
export declare const toStoredPath: (absoluteFilePath: string) => string;
//# sourceMappingURL=fileUpload.d.ts.map