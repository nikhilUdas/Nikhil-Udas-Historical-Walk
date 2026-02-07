import multer from 'multer';
import path from 'path';

// Configure memory storage for multer
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow only image files
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Convert image file to base64 string
export const fileToBase64 = (file: Express.Multer.File): string => {
  if (!file || !file.buffer) {
    throw new Error('No file provided');
  }
  return file.buffer.toString('base64');
};

// Convert base64 string to buffer
export const base64ToBuffer = (base64String: string): Buffer => {
  return Buffer.from(base64String, 'base64');
};

// Create data URL from base64
export const base64ToDataURL = (base64String: string, mimeType: string = 'image/jpeg'): string => {
  return `data:${mimeType};base64,${base64String}`;
};
