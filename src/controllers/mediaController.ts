import type { Request, Response } from "express";
import prisma from "../models/index.js";
import { sendStoredFile } from "../utils/mediaPath.js";

// Get Story image
export const getStoryImage = async (req: Request, res: Response) => {
  const { story_id } = req.params;
  try {
    const story = await prisma.story.findUnique({
      where: { story_id: Number(story_id) },
      select: { media_path: true },
    });

    if (!story || !story.media_path) {
      return res.status(404).json({ message: "Image not found" });
    }

    return sendStoredFile(res, story.media_path, "Image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// Get Additional Heritage Site Image
export const getHeritageSiteAdditionalImage = async (
  req: Request,
  res: Response,
) => {
  const { image_id } = req.params;
  try {
    const image = await prisma.heritageSiteImage.findUnique({
      where: { image_id: Number(image_id) },
      select: { image_path: true },
    });

    if (!image || !image.image_path) {
      return res.status(404).json({ message: "Image not found" });
    }

    return sendStoredFile(res, image.image_path, "Image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// Get Additional Museum Image
export const getMuseumAdditionalImage = async (req: Request, res: Response) => {
  const { image_id } = req.params;
  try {
    const image = await prisma.museumImage.findUnique({
      where: { image_id: Number(image_id) },
      select: { image_path: true },
    });

    if (!image || !image.image_path) {
      return res.status(404).json({ message: "Image not found" });
    }

    return sendStoredFile(res, image.image_path, "Image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// Get User Profile Image
export const getUserProfileImage = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: Number(user_id) },
      select: { profile_image: true },
    });

    if (!user || !user.profile_image) {
      console.log(`[Media] Profile image not found for user ${user_id}`);
      return res.status(404).json({ message: "Profile image not found" });
    }

    return sendStoredFile(res, user.profile_image, "Profile image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// Get Heritage Site main image
export const getHeritageSiteImage = async (req: Request, res: Response) => {
  const { site_id } = req.params;
  try {
    const site = await prisma.heritageSite.findUnique({
      where: { site_id: Number(site_id) },
      select: { image_path: true },
    });

    if (!site || !site.image_path) {
      return res.status(404).json({ message: "Image not found" });
    }

    return sendStoredFile(res, site.image_path, "Image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};

// Get Museum main image
export const getMuseumImage = async (req: Request, res: Response) => {
  const { museum_id } = req.params;
  try {
    const museum = await prisma.museum.findUnique({
      where: { museum_id: Number(museum_id) },
      select: { image_path: true },
    });

    if (!museum || !museum.image_path) {
      return res.status(404).json({ message: "Image not found" });
    }

    return sendStoredFile(res, museum.image_path, "Image not found");
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error retrieving image", error: error.message });
  }
};
