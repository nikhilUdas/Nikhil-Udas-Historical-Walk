import fs from "fs";
import multer from "multer";
import path from "path";
export const ensureDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
export const initializeUploadDirectories = () => {
    const baseDir = path.join(process.cwd(), "uploads");
    const subDirs = ["stories", "users", "museums", "sites", "reviews", "misc"];
    console.log(`Initializing upload directories at: ${baseDir}`);
    ensureDirectory(baseDir);
    subDirs.forEach(subDir => {
        const subDirPath = path.join(baseDir, subDir);
        ensureDirectory(subDirPath);
        console.log(`- Verified directory: ${subDir}`);
    });
    console.log("Upload directories initialized successfully");
};
const sanitizeFilename = (name) => name.replace(/[^a-zA-Z0-9._-]/g, "_");
const getUploadSubDirectory = (req, file) => {
    const baseUrl = String(req.baseUrl || "");
    if (file.fieldname === "media")
        return "stories";
    if (baseUrl.includes("/museums"))
        return "museums";
    if (baseUrl.includes("/sites"))
        return "sites";
    if (baseUrl.includes("/reviews") || baseUrl.includes("/users/reviews"))
        return "reviews";
    if (file.fieldname === "images")
        return "sites";
    if (file.fieldname === "image")
        return "users";
    return "misc";
};
// Configure memory storage to store image data directly in DB as Base64.
const storage = multer.memoryStorage();
// File filter to allow only images
const fileFilter = (req, file, cb) => {
    // Allow only image files
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"));
    }
};
// Create multer upload instance
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Increased to 10MB to accommodate Base64 overhead
    },
});
import sharp from "sharp";
/**
 * Converts a file buffer to a compressed Base64 Data URI string.
 * Resizes to max 1024px width/height and reduces quality to 80%.
 */
export const fileToBase64 = async (file) => {
    try {
        // Compress image using sharp
        const compressedBuffer = await sharp(file.buffer)
            .resize({
            width: 1024,
            height: 1024,
            fit: "inside",
            withoutEnlargement: true,
        })
            .jpeg({ quality: 80 }) // Convert TO JPEG for better compression as Base64
            .toBuffer();
        const base64Data = compressedBuffer.toString("base64");
        return `data:image/jpeg;base64,${base64Data}`;
    }
    catch (error) {
        console.error("Error compressing image:", error);
        // Fallback to original if compression fails
        const base64Data = file.buffer.toString("base64");
        return `data:${file.mimetype};base64,${base64Data}`;
    }
};
// Deprecated: Use fileToBase64 instead. Keeping for compatibility during migration.
export const toStoredPath = (absoluteFilePath) => {
    return absoluteFilePath;
};
//# sourceMappingURL=fileUpload.js.map