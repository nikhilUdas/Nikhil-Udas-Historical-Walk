import { submitReview, getReviewSummary } from '../services/reviewService.js';

// Example: Submit a review
async function exampleSubmitReview() {
  try {
    const review = await submitReview({
      type: 'doctor',
      id: 'doc123',
      rating: 5,
      comment: 'Excellent service!',
      userId: 'user456'
    });
    console.log('Review submitted:', review);
  } catch (error) {
    console.error('Error submitting review:', error);
  }
}

// Example: Get review summary
async function exampleGetSummary() {
  try {
    const summary = await getReviewSummary('doctor', 'doc123');
    console.log('Review summary:', summary);
    console.log(`Average rating: ${summary.averageRating}`);
    console.log(`Total reviews: ${summary.totalReviews}`);
  } catch (error) {
    console.error('Error fetching summary:', error);
  }
}
