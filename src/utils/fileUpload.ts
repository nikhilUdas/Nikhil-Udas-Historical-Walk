import fs from "fs";
import multer from "multer";
import path from "path";

export const ensureDirectory = (dirPath: string) => {
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

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const getUploadSubDirectory = (req: any, file: Express.Multer.File): string => {
  const baseUrl = String(req.baseUrl || "");

  if (file.fieldname === "media") return "stories";
  if (baseUrl.includes("/museums")) return "museums";
  if (baseUrl.includes("/sites")) return "sites";
  if (baseUrl.includes("/reviews") || baseUrl.includes("/users/reviews")) return "reviews";
  if (file.fieldname === "images") return "sites";
  if (file.fieldname === "image") return "users";
  return "misc";
};

// Configure disk storage so only file paths are persisted in the database.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = getUploadSubDirectory(req, file);
    const destination = path.join(process.cwd(), "uploads", subDir);
    ensureDirectory(destination);
    cb(null, destination);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg";
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sanitizeFilename(baseName)}-${uniqueSuffix}${extension}`);
  },
});

// File filter to allow only images
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Allow only image files
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"));
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

// Store paths in DB as workspace-relative, forward-slash URLs.
export const toStoredPath = (absoluteFilePath: string): string => {
  const relative = path.relative(process.cwd(), absoluteFilePath);
  return relative.split(path.sep).join("/");
};
