import fs from "fs";
import path from "path";
const toAbsolutePath = (storedPath) => path.isAbsolute(storedPath)
    ? storedPath
    : path.resolve(process.cwd(), storedPath);
export const sendStoredFile = (res, storedPath, notFoundMessage = "Image not found") => {
    const absolutePath = toAbsolutePath(storedPath);
    if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: notFoundMessage });
    }
    return res.sendFile(absolutePath);
};
//# sourceMappingURL=mediaPath.js.map