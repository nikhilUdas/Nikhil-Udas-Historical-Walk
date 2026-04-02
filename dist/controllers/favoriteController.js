import prisma from '../models/index.js';
/**
 * Toggle favorite status for a heritage site
 */
export const toggleFavorite = async (req, res) => {
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
            try {
                await prisma.favoriteSite.delete({
                    where: {
                        fav_id: existingFavorite.fav_id,
                    },
                });
                return res.status(200).json({
                    message: 'Removed from favorites',
                    isFavorite: false
                });
            }
            catch (error) {
                // P2025 is "Record to delete does not exist."
                if (error.code === 'P2025') {
                    return res.status(200).json({
                        message: 'Removed from favorites',
                        isFavorite: false
                    });
                }
                throw error;
            }
        }
        else {
            // Add to favorites
            try {
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
            catch (error) {
                // P2002 is "Unique constraint failed"
                if (error.code === 'P2002') {
                    return res.status(201).json({
                        message: 'Added to favorites',
                        isFavorite: true
                    });
                }
                throw error;
            }
        }
    }
    catch (error) {
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
export const getUserFavorites = async (req, res) => {
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
    }
    catch (error) {
        console.error('Error fetching user favorites:', error);
        return res.status(500).json({
            message: 'Error fetching user favorites',
            error: error.message
        });
    }
};
//# sourceMappingURL=favoriteController.js.map