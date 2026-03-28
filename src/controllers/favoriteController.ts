import type { Request, Response } from 'express';
import prisma from '../models/index.js';

/**
 * Toggle favorite status for a heritage site
 */
export const toggleFavorite = async (req: Request, res: Response) => {
  const { site_id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!site_id) {
    return res.status(400).json({ message: 'Site ID is required' });
  }

  const siteId = parseInt(site_id);
  if (isNaN(siteId)) {
    return res.status(400).json({ message: 'Invalid Site ID' });
  }

  try {
    // Check if site exists
    const site = await prisma.heritageSite.findUnique({
      where: { site_id: siteId },
    });

    if (!site) {
      return res.status(404).json({ message: 'Heritage site not found' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteSite.findUnique({
      where: {
        user_id_site_id: {
          user_id: userId,
          site_id: siteId,
        },
      },
    });

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favoriteSite.delete({
        where: {
          fav_id: existingFavorite.fav_id,
        },
      });
      return res.status(200).json({ 
        message: 'Removed from favorites', 
        isFavorite: false 
      });
    } else {
      // Add to favorites
      await prisma.favoriteSite.create({
        data: {
          user_id: userId,
          site_id: siteId,
        },
      });
      return res.status(201).json({ 
        message: 'Added to favorites', 
        isFavorite: true 
      });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return res.status(500).json({ 
      message: 'Error toggling favorite', 
      error: error.message 
    });
  }
};

/**
 * Get all favorite sites for the authenticated user
 */
export const getUserFavorites = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const favorites = await prisma.favoriteSite.findMany({
      where: { user_id: userId },
      include: {
        site: true,
      },
    });

    return res.status(200).json({
      favorites: favorites.map(fav => fav.site),
    });
  } catch (error: any) {
    console.error('Error fetching user favorites:', error);
    return res.status(500).json({ 
      message: 'Error fetching user favorites', 
      error: error.message 
    });
  }
};
