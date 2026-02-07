// In-memory storage for reviews
const reviewsStore = [];
/**
 * Submit a new review
 */
export const submitReview = async (req, res) => {
    try {
        console.log('Received review submission:', req.body); // Debug log
        const { type, id, rating, comment, userId } = req.body;
        // Validation
        if (!type || !id || !rating) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: type, id, and rating'
            });
            return;
        }
        if (!['doctor', 'hospital'].includes(type)) {
            res.status(400).json({
                success: false,
                message: 'Invalid type. Must be "doctor" or "hospital"'
            });
            return;
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
            return;
        }
        const review = {
            type,
            id,
            rating: Number(rating),
            comment: comment || '',
            userId,
            createdAt: new Date()
        };
        reviewsStore.push(review);
        console.log('Review stored successfully:', review); // Debug log
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    }
    catch (error) {
        console.error('Error in submitReview:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
/**
 * Get review summary for a doctor or hospital
 */
export const getReviewSummary = async (req, res) => {
    try {
        const { type, id } = req.params;
        const reviews = reviewsStore.filter(review => review.type === type && review.id === id);
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        res.status(200).json({
            success: true,
            data: {
                type,
                id,
                averageRating: Number(averageRating.toFixed(2)),
                totalReviews,
                reviews
            }
        });
    }
    catch (error) {
        console.error('Error in getReviewSummary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review summary',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
//# sourceMappingURL=reviewController.js.map