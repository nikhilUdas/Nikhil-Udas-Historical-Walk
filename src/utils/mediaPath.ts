import type { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getFullUrl = (req: Request, storedPath: string | null): string | null => {
  if (!storedPath) return null;
  // If it's already a full URL, return it
  if (storedPath.startsWith("http")) return storedPath;
  
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
  const absolutePath = toAbsolutePath(storedPath);
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ message: notFoundMessage });
  }

  return res.sendFile(absolutePath);
};
