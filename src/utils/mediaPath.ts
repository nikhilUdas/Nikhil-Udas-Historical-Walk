import type { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getFullUrl = (req: Request, storedPath: string | null): string | null => {
  if (!storedPath) return null;
  // If it's already a full URL or a Base64 data URI, return it
  if (storedPath.startsWith("http") || storedPath.startsWith("data:")) return storedPath;
  
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}/${storedPath}`;
};

const toAbsolutePath = (storedPath: string): string =>
  path.isAbsolute(storedPath)
    ? storedPath
    : path.resolve(process.cwd(), storedPath);

export const sendStoredFile = (
  res: Response,
  storedPath: string,
  notFoundMessage = "Image not found",
) => {
  // If it's a Base64 Data URI
  if (storedPath.startsWith("data:")) {
    const matches = storedPath.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ message: "Invalid image data" });
    }
    const type = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    res.setHeader("Content-Type", type);
    return res.send(buffer);
  }

  const absolutePath = toAbsolutePath(storedPath);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ message: notFoundMessage });
  }

  return res.sendFile(absolutePath);
};
