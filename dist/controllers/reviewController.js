import prisma from '../models/index.js';
// Submit or update a review for a museum or heritage site
export const submitReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { museum_id, site_id, rating, thoughts } = req.body;
        // Validation
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Please log in' });
            return;
        }
        if ((!museum_id && !site_id) || rating === undefined || !thoughts) {
            res.status(400).json({
                message: 'Missing required fields: museum_id or site_id, rating (1-5), and thoughts are required',
            });
            return;
        }
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            res.status(400).json({
                message: 'Rating must be an integer between 1 and 5',
            });
            return;
        }
        if (thoughts.trim().length === 0) {
            res.status(400).json({
                message: 'Thoughts cannot be empty',
            });
            return;
        }
        let existingReview = null;
        if (museum_id) {
            // Check if museum exists
            const museum = await prisma.museum.findUnique({
                where: { museum_id: Number(museum_id) },
            });
            if (!museum) {
                res.status(404).json({ message: 'Museum not found' });
                return;
            }
            // Check if user has already reviewed this museum
            existingReview = await prisma.review.findUnique({
                where: {
                    user_id_museum_id: {
                        user_id: userId,
                        museum_id: Number(museum_id),
                    },
                },
            });
        }
        else if (site_id) {
            // Check if heritage site exists
            const site = await prisma.heritageSite.findUnique({
                where: { site_id: Number(site_id) },
            });
            if (!site) {
                res.status(404).json({ message: 'Heritage site not found' });
                return;
            }
            // Check if user has already reviewed this site
            existingReview = await prisma.review.findUnique({
                where: {
                    user_id_site_id: {
                        user_id: userId,
                        site_id: Number(site_id),
                    },
                },
            });
        }
        let review;
        if (existingReview) {
            // Update existing review
            review = await prisma.review.update({
                where: { review_id: existingReview.review_id },
                data: {
                    rating: Number(rating),
                    thoughts,
                },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true,
                        },
                    },
                    museum: {
                        select: {
                            museum_id: true,
                            name: true,
                        },
                    },
                    site: {
                        select: {
                            site_id: true,
                            name: true,
                        },
                    },
                },
            });
            res.status(200).json({
                message: 'Review updated successfully',
                review,
            });
        }
        else {
            // Create new review
            review = await prisma.review.create({
                data: {
                    user_id: userId,
                    museum_id: museum_id ? Number(museum_id) : undefined,
                    site_id: site_id ? Number(site_id) : undefined,
                    rating: Number(rating),
                    thoughts,
                },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true,
                        },
                    },
                    museum: {
                        select: {
                            museum_id: true,
                            name: true,
                        },
                    },
                    site: {
                        select: {
                            site_id: true,
                            name: true,
                        },
                    },
                },
            });
            res.status(201).json({
                message: 'Review submitted successfully',
                review,
            });
        }
    }
    catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({
            message: 'Error submitting review',
            error: error.message,
        });
    }
};
// Get review summary for a museum or site
export const getReviewSummary = async (req, res) => {
    try {
        const { museum_id, site_id } = req.query;
        if (!museum_id && !site_id) {
            res.status(400).json({ message: 'Museum ID or Site ID is required' });
            return;
        }
        const filter = {};
        let itemTitle = 'Item';
        if (museum_id) {
            filter.museum_id = Number(museum_id);
            const museum = await prisma.museum.findUnique({ where: { museum_id: Number(museum_id) } });
            if (!museum) {
                res.status(404).json({ message: 'Museum not found' });
                return;
            }
            itemTitle = museum.name;
        }
        else {
            filter.site_id = Number(site_id);
            const site = await prisma.heritageSite.findUnique({ where: { site_id: Number(site_id) } });
            if (!site) {
                res.status(404).json({ message: 'Heritage site not found' });
                return;
            }
            itemTitle = site.name;
        }
        // Get all reviews for the target
        const reviews = await prisma.review.findMany({
            where: filter,
            include: {
                user: {
                    select: {
                        user_id: true,
                        name: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
            : 0;
        // Count reviews by star rating
        const ratingDistribution = {
            '5': reviews.filter((r) => r.rating === 5).length,
            '4': reviews.filter((r) => r.rating === 4).length,
            '3': reviews.filter((r) => r.rating === 3).length,
            '2': reviews.filter((r) => r.rating === 2).length,
            '1': reviews.filter((r) => r.rating === 1).length,
        };
        res.status(200).json({
            item: {
                id: museum_id || site_id,
                name: itemTitle,
            },
            averageRating,
            totalReviews,
            ratingDistribution,
            reviews,
        });
    }
    catch (error) {
        console.error('Error fetching review summary:', error);
        res.status(500).json({
            message: 'Error fetching review summary',
            error: error.message,
        });
    }
};
// Get all reviews across all museums and sites
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        user_id: true,
                        name: true,
                    },
                },
                museum: {
                    select: {
                        museum_id: true,
                        name: true,
                    },
                },
                site: {
                    select: {
                        site_id: true,
                        name: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        // Calculate statistics
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
            : 0;
        // Count reviews by star rating
        const ratingDistribution = {
            '5': reviews.filter((r) => r.rating === 5).length,
            '4': reviews.filter((r) => r.rating === 4).length,
            '3': reviews.filter((r) => r.rating === 3).length,
            '2': reviews.filter((r) => r.rating === 2).length,
            '1': reviews.filter((r) => r.rating === 1).length,
        };
        res.status(200).json({
            message: 'All reviews retrieved successfully',
            totalReviews,
            averageRating,
            ratingDistribution,
            reviews,
        });
    }
    catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({
            message: 'Error fetching all reviews',
            error: error.message,
        });
    }
};
// Get all reviews submitted by a user
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Please log in' });
            return;
        }
        const reviews = await prisma.review.findMany({
            where: { user_id: userId },
            include: {
                museum: {
                    select: {
                        museum_id: true,
                        name: true,
                    },
                },
                site: {
                    select: {
                        site_id: true,
                        name: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        res.status(200).json({
            reviews,
            count: reviews.length,
        });
    }
    catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            message: 'Error fetching user reviews',
            error: error.message,
        });
    }
};
// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { review_id } = req.params;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Please log in' });
            return;
        }
        // Check if review exists and belongs to the user
        const review = await prisma.review.findUnique({
            where: { review_id: Number(review_id) },
        });
        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }
        if (review.user_id !== userId) {
            res.status(403).json({ message: 'Forbidden: You can only delete your own reviews' });
            return;
        }
        await prisma.review.delete({
            where: { review_id: Number(review_id) },
        });
        res.status(200).json({
            message: 'Review deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            message: 'Error deleting review',
            error: error.message,
        });
    }
};
//# sourceMappingURL=reviewController.js.map