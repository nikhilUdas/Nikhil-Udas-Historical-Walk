import type { Request, Response } from "express";
import "../middleware/auth.js";
import prisma from "../models/index.js";
import { broadcastNotificationToAll } from "../services/socketService.js";
import { toStoredPath } from "../utils/fileUpload.js";
import { sendStoredFile } from "../utils/mediaPath.js";

// Add a new heritage site
export const addHeritageSite = async (req: Request, res: Response) => {
  const { name, description, photo_url, gps_coordinates } = req.body;
  const files = (req as any).files;
  const file =
    files && Array.isArray(files) && files.length > 0
      ? files[0]
      : (req as any).file;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can add heritage sites" });
  }

  // Validate required fields - photo_url is optional if an image file is provided
  if (!name || !description || (!photo_url && !file) || !gps_coordinates) {
    return res.status(400).json({
      message:
        "Missing required fields: name, description, (photo_url or image file), and gps_coordinates are required",
    });
  }

  try {
    // Check if site with same name already exists
    const existingSite = await prisma.heritageSite.findFirst({
      where: { name: name },
    });

    if (existingSite) {
      return res
        .status(400)
        .json({ message: "Heritage site with this name already exists" });
    }

    const mainImagePath = file?.path ? toStoredPath(file.path) : null;

    // Create the heritage site
    const site = await prisma.heritageSite.create({
      data: {
        name,
        description,
        photo_url: mainImagePath || photo_url,
        gps_coordinates,
        image_path: mainImagePath || null,
      },
    });

    // Handle multiple images if provided
    if (files && Array.isArray(files)) {
      // If we used the first file for imageData, we might want to skip it here to avoid duplication
      // but the user said "even if I upload single image it should be added and even if I add multiple"
      // The images table is for ADDITIONAL images.
      const additionalFiles = files.length > 1 ? files.slice(1) : [];
      const imagePromises = additionalFiles.map(async (file: any) => {
        try {
          return prisma.heritageSiteImage.create({
            data: {
              site_id: site.site_id,
              image_path: toStoredPath(file.path),
            },
          });
        } catch (err) {
          console.error("Error processing additional image:", err);
        }
      });
      await Promise.all(imagePromises);
    }

    // Broadcast notification to all users about new heritage site
    const notification = {
      type: "heritage_site_added",
      title: "New Heritage Site Added",
      message: `A new heritage site "${name}" has been added! Explore its rich history and cultural significance.`,
      related_id: site.site_id,
    };
    await broadcastNotificationToAll(notification);

    return res.status(201).json({
      message: "Heritage site added successfully",
      site: {
        ...site,
        image_url: site.photo_url || site.image_path || null,
        additional_images: [],
      },
    });
  } catch (error: any) {
    console.error("Error adding heritage site:", error);
    return res.status(500).json({
      message: "Error adding heritage site",
      error: error.message,
    });
  }
};

// Update a heritage site
export const updateHeritageSite = async (req: Request, res: Response) => {
  const { site_id } = req.params;
  const { name, description, photo_url, gps_coordinates } = req.body;
  const files = (req as any).files;
  const file =
    files && Array.isArray(files) && files.length > 0 ? files[0] : null;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can edit heritage sites" });
  }

  if (!site_id) {
    return res.status(400).json({ message: "Site ID is required" });
  }

  try {
    // Check if site exists
    const existingSite = await prisma.heritageSite.findUnique({
      where: { site_id: Number(site_id) },
    });

    if (!existingSite) {
      return res.status(404).json({ message: "Heritage site not found" });
    }

    // Build update data object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (gps_coordinates !== undefined)
      updateData.gps_coordinates = gps_coordinates;

    // Handle image update if file is provided
    if (file) {
      const storedPath = toStoredPath(file.path);
      updateData.photo_url = storedPath;
      updateData.image_path = storedPath;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Check if new name already exists (if name is being changed)
    if (name && name !== existingSite.name) {
      const siteWithName = await prisma.heritageSite.findFirst({
        where: { name: name },
      });
      if (siteWithName) {
        return res
          .status(400)
          .json({ message: "Heritage site with this name already exists" });
      }
    }

    // Update the heritage site
    const updatedSite = await prisma.heritageSite.update({
      where: { site_id: Number(site_id) },
      data: updateData,
    });

    // Handle multiple images update (Append new images)
    if (files && Array.isArray(files) && files.length > 0) {
      // First file is already used as the main image_data, skip it for additional images
      const additionalFiles = files.length > 1 ? files.slice(1) : [];
      const imagePromises = additionalFiles.map(async (f: any) => {
        try {
          return prisma.heritageSiteImage.create({
            data: {
              site_id: updatedSite.site_id,
              image_path: toStoredPath(f.path),
            },
          });
        } catch (err) {
          console.error(
            "Error processing additional image during update:",
            err,
          );
        }
      });
      await Promise.all(imagePromises);
    }

    return res.status(200).json({
      message: "Heritage site updated successfully",
      site: {
        ...updatedSite,
        image_url: updatedSite.photo_url || updatedSite.image_path || null,
      },
    });
  } catch (error: any) {
    console.error("Error updating heritage site:", error);
    return res.status(500).json({
      message: "Error updating heritage site",
      error: error.message,
    });
  }
};

// Delete a heritage site
export const deleteHeritageSite = async (req: Request, res: Response) => {
  const { site_id } = req.params;

  // Verify user is admin
  if (req.user?.type !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only admins can delete heritage sites" });
  }

  if (!site_id) {
    return res.status(400).json({ message: "Site ID is required" });
  }

  try {
    // Check if site exists
    const existingSite = await prisma.heritageSite.findUnique({
      where: { site_id: Number(site_id) },
    });

    if (!existingSite) {
      return res.status(404).json({ message: "Heritage site not found" });
    }

    // Delete the heritage site (cascades to related stories, routes, favorites)
    await prisma.heritageSite.delete({
      where: { site_id: Number(site_id) },
    });

    return res.status(200).json({
      message: "Heritage site deleted successfully",
      deletedSiteId: Number(site_id),
    });
  } catch (error: any) {
    console.error("Error deleting heritage site:", error);
    return res.status(500).json({
      message: "Error deleting heritage site",
      error: error.message,
    });
  }
};

export const getAllHeritageSites = async (req: Request, res: Response) => {
  try {
    const sites = await prisma.heritageSite.findMany({
      include: {
        stories: true,
        routes: true,
        images: {
          select: {
            image_id: true,
            image_path: true,
          },
        },
      },
      orderBy: {
        site_id: "desc",
      },
    });

    const userId = req.user?.userId;
    let purchasedSiteIds: number[] = [];

    if (userId) {
      const purchases = await prisma.sitePayment.findMany({
        where: { user_id: userId, status: "completed" },
        select: { site_id: true },
      });
      purchasedSiteIds = purchases.map((p) => p.site_id);
    }

    // Transform sites to include image data as data URLs and truncated descriptions
    const sitesWithImages = sites.map((site) => {
      const isUnlocked =
        purchasedSiteIds.includes(site.site_id) || req.user?.type === "admin";
      let displayDescription = site.description;
      let hasFullContent = false;

      // Always truncate for list view to show only 20%
      const previewLen = Math.max(
        50,
        Math.floor(site.description.length * 0.2),
      );
      if (site.description.length > previewLen) {
        displayDescription = site.description.substring(0, previewLen) + "...";
        hasFullContent = true;
      }

      console.log("SITES", sites);

      return {
        ...site,
        description: displayDescription,
        full_description: isUnlocked ? site.description : null,
        is_unlocked: isUnlocked,
        has_full_content: hasFullContent,
        image_url: site.photo_url || site.image_path || null,
        additional_images: site.images.map((img) => img.image_path),
      };
    });

    return res.status(200).json({
      message: "Heritage sites retrieved successfully",
      count: sitesWithImages.length,
      sites: sitesWithImages,
    });
  } catch (error: any) {
    console.error("Error fetching heritage sites:", error);
    return res.status(500).json({
      message: "Error fetching heritage sites",
      error: error.message,
    });
  }
};

// Get a single heritage site by ID
export const getHeritageSiteById = async (req: Request, res: Response) => {
  const { site_id } = req.params;

  if (!site_id) {
    return res.status(400).json({ message: "Site ID is required" });
  }

  try {
    const site = await prisma.heritageSite.findUnique({
      where: { site_id: Number(site_id) },
      include: {
        stories: true,
        routes: true,
        images: {
          select: {
            image_id: true,
            image_path: true,
          },
        },
      },
    });

    if (!site) {
      return res.status(404).json({ message: "Heritage site not found" });
    }

    let isUnlocked = req.user?.type === "admin";
    const userId = req.user?.userId;
    console.log(
      `[getHeritageSiteById] Checking unlock for site ${site_id}, userId: ${userId}, isAdmin: ${req.user?.type === "admin"}`,
    );

    if (userId && !isUnlocked) {
      const purchase = await prisma.sitePayment.findFirst({
        where: {
          user_id: Number(userId),
          site_id: Number(site_id),
          status: "completed",
        },
      });
      isUnlocked = !!purchase;
      console.log(`[getHeritageSiteById] Purchase found: ${isUnlocked}`);
    }

    let displayDescription = site.description;
    let hasFullContent = false;

    if (!isUnlocked) {
      const previewLen = Math.max(
        50,
        Math.floor(site.description.length * 0.2),
      );
      if (site.description.length > previewLen) {
        displayDescription = site.description.substring(0, previewLen) + "...";
        hasFullContent = true;
      }
    } else {
      // For unlocked sites, we still indicate hasFullContent if it was originally long,
      // so the UI knows to show "Read Now" instead of nothing if it was short.
      const previewLen = Math.max(
        50,
        Math.floor(site.description.length * 0.2),
      );
      if (site.description.length > previewLen) {
        hasFullContent = true;
      }
    }

    return res.status(200).json({
      message: "Heritage site retrieved successfully",
      site: {
        ...site,
        description: displayDescription,
        full_description: isUnlocked ? site.description : null,
        is_unlocked: isUnlocked,
        has_full_content: hasFullContent,
        image_url: site.photo_url || site.image_path || null,
        additional_images: site.images.map((img) => img.image_path),
      },
    });
  } catch (error: any) {
    console.error("Error fetching heritage site:", error);
    return res.status(500).json({
      message: "Error fetching heritage site",
      error: error.message,
    });
  }
};

// Get heritage site image by ID (Public)
export const getHeritageSiteImage = async (req: Request, res: Response) => {
  const { site_id } = req.params;

  if (!site_id) {
    return res.status(400).json({ message: "Site ID is required" });
  }

  try {
    const site = await prisma.heritageSite.findUnique({
      where: { site_id: Number(site_id) },
      select: {
        site_id: true,
        name: true,
        photo_url: true,
        image_path: true,
      },
    });

    if (!site) {
      return res.status(404).json({ message: "Heritage site not found" });
    }

    const storedPath = site.photo_url || site.image_path;
    if (!storedPath) {
      return res
        .status(404)
        .json({ message: "No image available for this heritage site" });
    }

    return sendStoredFile(
      res,
      storedPath,
      "No image available for this heritage site",
    );
  } catch (error: any) {
    console.error("Error fetching heritage site image:", error);
    return res.status(500).json({
      message: "Error fetching heritage site image",
      error: error.message,
    });
  }
};
