const MOCK_API_URL = 'http://localhost:3001'; // Adjust port if different
/**
 * Submit a new review
 */
export const submitReview = async (review) => {
    const response = await fetch(`${MOCK_API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });
    if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.statusText}`);
    }
    return response.json();
};
/**
 * Get review summary for a doctor or hospital
 */
export const getReviewSummary = async (type, id) => {
    const response = await fetch(`${MOCK_API_URL}/reviews/${type}/${id}/summary`);
    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    return response.json();
};
//# sourceMappingURL=reviewService.js.map