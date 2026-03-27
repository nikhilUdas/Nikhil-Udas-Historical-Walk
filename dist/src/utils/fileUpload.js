import multer from 'multer';
// Configure memory storage for multer
const storage = multer.memoryStorage();
// File filter to allow only images
const fileFilter = (req, file, cb) => {
    // Allow only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
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
// Helper to check if a buffer is valid image data
export const isValidImageBuffer = (buffer) => {
    return buffer && buffer.length > 0;
};
//# sourceMappingURL=fileUpload.js.map