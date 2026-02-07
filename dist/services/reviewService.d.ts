export interface Review {
    type: 'doctor' | 'hospital';
    id: string;
    rating: number;
    comment: string;
    userId?: string;
}
export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    reviews: Review[];
}
/**
 * Submit a new review
 */
export declare const submitReview: (review: Review) => Promise<Review>;
/**
 * Get review summary for a doctor or hospital
 */
export declare const getReviewSummary: (type: "doctor" | "hospital", id: string) => Promise<ReviewSummary>;
//# sourceMappingURL=reviewService.d.ts.map