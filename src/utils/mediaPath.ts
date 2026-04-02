import type { Response } from "express";
import fs from "fs";
import path from "path";

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
