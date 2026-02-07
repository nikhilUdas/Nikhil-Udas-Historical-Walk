const MOCK_API_URL = 'http://localhost:3001'; // Adjust port if different

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
export const submitReview = async (review: Review): Promise<Review> => {
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

  return response.json() as Promise<Review>;
};

/**
 * Get review summary for a doctor or hospital
 */
export const getReviewSummary = async (
  type: 'doctor' | 'hospital',
  id: string
): Promise<ReviewSummary> => {
  const response = await fetch(`${MOCK_API_URL}/reviews/${type}/${id}/summary`);

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  }

  return response.json() as Promise<ReviewSummary>;
};
