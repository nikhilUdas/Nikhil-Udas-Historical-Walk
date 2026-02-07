# Museum Review System API Documentation

## Overview
The review system allows users to submit ratings (1-5 stars) and thoughts about museums they've visited. Each user can submit one review per museum, and can update their review at any time.

---

## Review Model

```typescript
model Review {
  review_id   Int      @id @default(autoincrement())
  user_id     Int
  museum_id   Int
  rating      Int      // 1-5 stars
  thoughts    String   @db.Text
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  user   User   @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  museum Museum @relation(fields: [museum_id], references: [museum_id], onDelete: Cascade)

  @@unique([user_id, museum_id])  // One review per user per museum
}
```

---

## API Endpoints

### Base URL
```
http://localhost:8000/api/users
```

---

## 1. Submit or Update a Review

**Endpoint:** `POST /api/users/reviews`  
**Authentication:** Required  
**Method:** POST  
**Description:** Submit a new review or update an existing review for a museum

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "museum_id": 1,
  "rating": 4,
  "thoughts": "Amazing museum with great exhibits and knowledgeable staff. Definitely worth a visit!"
}
```

**Request Parameters:**
- `museum_id` (required, number): The ID of the museum being reviewed
- `rating` (required, integer): Rating from 1-5 stars
- `thoughts` (required, string): User's review text/thoughts about the museum

**Success Response (201 - New Review):**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "review_id": 1,
    "user_id": 5,
    "museum_id": 1,
    "rating": 4,
    "thoughts": "Amazing museum with great exhibits and knowledgeable staff. Definitely worth a visit!",
    "created_at": "2026-01-14T13:30:00Z",
    "updated_at": "2026-01-14T13:30:00Z",
    "user": {
      "user_id": 5,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "museum": {
      "museum_id": 1,
      "name": "National Museum"
    }
  }
}
```

**Success Response (200 - Updated Review):**
```json
{
  "message": "Review updated successfully",
  "review": {
    "review_id": 1,
    "user_id": 5,
    "museum_id": 1,
    "rating": 5,
    "thoughts": "Updated: Absolutely fantastic! One of the best museums I've visited.",
    "created_at": "2026-01-14T13:30:00Z",
    "updated_at": "2026-01-14T13:45:00Z",
    "user": {
      "user_id": 5,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "museum": {
      "museum_id": 1,
      "name": "National Museum"
    }
  }
}
```

**Error Responses:**
- `400` - Missing fields or invalid rating (must be 1-5)
- `401` - Unauthorized (not logged in)
- `404` - Museum not found
- `500` - Server error

**cURL Examples:**

*Submit new review:*
```bash
curl -X POST http://localhost:8000/api/users/reviews \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "museum_id": 1,
    "rating": 4,
    "thoughts": "Amazing museum! Great exhibits."
  }'
```

*Update existing review:*
```bash
curl -X POST http://localhost:8000/api/users/reviews \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "museum_id": 1,
    "rating": 5,
    "thoughts": "Updated review: Even better on second visit!"
  }'
```

---

## 2. Get Museum Reviews Summary

**Endpoint:** `GET /api/users/reviews/museum/:museum_id`  
**Authentication:** Not required  
**Method:** GET  
**Description:** Get all reviews for a specific museum with average rating and distribution

**URL Parameters:**
- `museum_id` (required): The ID of the museum

**Success Response (200):**
```json
{
  "museum": {
    "museum_id": 1,
    "name": "National Museum"
  },
  "averageRating": 4.5,
  "totalReviews": 4,
  "ratingDistribution": {
    "5": 2,
    "4": 1,
    "3": 1,
    "2": 0,
    "1": 0
  },
  "reviews": [
    {
      "review_id": 1,
      "user_id": 5,
      "museum_id": 1,
      "rating": 5,
      "thoughts": "Absolutely fantastic museum!",
      "created_at": "2026-01-14T13:30:00Z",
      "updated_at": "2026-01-14T13:30:00Z",
      "user": {
        "user_id": 5,
        "name": "John Doe"
      }
    },
    {
      "review_id": 2,
      "user_id": 6,
      "museum_id": 1,
      "rating": 4,
      "thoughts": "Great museum with interesting exhibits.",
      "created_at": "2026-01-14T12:00:00Z",
      "updated_at": "2026-01-14T12:00:00Z",
      "user": {
        "user_id": 6,
        "name": "Jane Smith"
      }
    }
  ]
}
```

**Error Response (404):**
```json
{
  "message": "Museum not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/users/reviews/museum/1 \
  -H "Content-Type: application/json"
```

---

## 3. Get User's Reviews

**Endpoint:** `GET /api/users/reviews/my-reviews`  
**Authentication:** Required  
**Method:** GET  
**Description:** Get all reviews submitted by the authenticated user

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "reviews": [
    {
      "review_id": 1,
      "user_id": 5,
      "museum_id": 1,
      "rating": 5,
      "thoughts": "Absolutely fantastic museum!",
      "created_at": "2026-01-14T13:30:00Z",
      "updated_at": "2026-01-14T13:30:00Z",
      "museum": {
        "museum_id": 1,
        "name": "National Museum",
        "description": "A museum dedicated to national heritage"
      }
    },
    {
      "review_id": 3,
      "user_id": 5,
      "museum_id": 2,
      "rating": 3,
      "thoughts": "Good museum, but could use better signage.",
      "created_at": "2026-01-13T10:15:00Z",
      "updated_at": "2026-01-13T10:15:00Z",
      "museum": {
        "museum_id": 2,
        "name": "Art Museum",
        "description": "A museum featuring contemporary art"
      }
    }
  ],
  "count": 2
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized: Please log in"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/users/reviews/my-reviews \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

## 4. Delete a Review

**Endpoint:** `DELETE /api/users/reviews/:review_id`  
**Authentication:** Required  
**Method:** DELETE  
**Description:** Delete a review submitted by the authenticated user

**URL Parameters:**
- `review_id` (required): The ID of the review to delete

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "message": "Review deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (can only delete own reviews)
- `404` - Review not found
- `500` - Server error

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/users/reviews/1 \
  -H "Authorization: Bearer your_jwt_token_here" \
  -H "Content-Type: application/json"
```

---

## Key Features

✅ **One Review Per User Per Museum** - Users can only have one active review per museum  
✅ **Update Existing Reviews** - Submitting a review for a museum you've already reviewed updates it  
✅ **Rating Distribution** - Automatically calculates breakdown of 1-5 star ratings  
✅ **Average Rating** - Shows the average rating across all reviews  
✅ **Sorted by Recency** - Reviews are displayed with newest first  
✅ **User Information** - Each review includes the reviewer's name  
✅ **Museum Information** - Includes museum details in responses

---

## Validation Rules

- **Rating:** Must be an integer between 1 and 5
- **Thoughts:** Cannot be empty or only whitespace
- **Museum ID:** Must exist in the database
- **User Authentication:** Required for submit, update, delete operations
- **Authorization:** Users can only delete their own reviews

---

## Testing Examples

### Test 1: Submit a Review
```bash
curl -X POST http://localhost:8000/api/users/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "museum_id": 1,
    "rating": 5,
    "thoughts": "Incredible museum! The exhibits are well-organized and the staff is very helpful. Highly recommended!"
  }'
```

### Test 2: View Museum Reviews
```bash
curl -X GET http://localhost:8000/api/users/reviews/museum/1 \
  -H "Content-Type: application/json"
```

### Test 3: Get Your Reviews
```bash
curl -X GET http://localhost:8000/api/users/reviews/my-reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Test 4: Delete a Review
```bash
curl -X DELETE http://localhost:8000/api/users/reviews/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Frontend Implementation Example

### React Component
```javascript
import { useState, useEffect } from 'react';

function MuseumReviews({ museumId, jwtToken }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userThoughts, setUserThoughts] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch museum reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`http://localhost:8000/api/users/reviews/museum/${museumId}`);
      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    };
    fetchReviews();
  }, [museumId]);

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('http://localhost:8000/api/users/reviews', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        museum_id: museumId,
        rating: userRating,
        thoughts: userThoughts
      })
    });

    if (response.ok) {
      const data = await response.json();
      setReviews([data.review, ...reviews]);
      setUserRating(0);
      setUserThoughts('');
    }
    setLoading(false);
  };

  return (
    <div className="reviews-section">
      <h2>Reviews</h2>
      <p>Average Rating: {averageRating} ⭐</p>

      <form onSubmit={handleSubmitReview}>
        <label>Your Rating:</label>
        <select value={userRating} onChange={(e) => setUserRating(parseInt(e.target.value))}>
          <option value={0}>Select rating...</option>
          <option value={1}>1 - Poor</option>
          <option value={2}>2 - Fair</option>
          <option value={3}>3 - Good</option>
          <option value={4}>4 - Very Good</option>
          <option value={5}>5 - Excellent</option>
        </select>

        <label>Your Thoughts:</label>
        <textarea 
          value={userThoughts} 
          onChange={(e) => setUserThoughts(e.target.value)}
          placeholder="Share your experience..."
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.review_id} className="review-card">
            <h4>{review.user.name}</h4>
            <p>Rating: {'⭐'.repeat(review.rating)}</p>
            <p>{review.thoughts}</p>
            <small>{new Date(review.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MuseumReviews;
```

---

## Database Schema

The Review model is linked to:
- **User** - The user who submitted the review (one-to-many)
- **Museum** - The museum being reviewed (one-to-many)

**Unique Constraint:** `@@unique([user_id, museum_id])` - Ensures each user can only have one review per museum

---

## Future Enhancements

- [ ] Add review images/photos
- [ ] Helpful/unhelpful votes on reviews
- [ ] Review moderation (flag inappropriate reviews)
- [ ] Reply to reviews
- [ ] Sort by helpful/recent/rating
- [ ] Filter reviews by rating
- [ ] Verified purchase badge for reviews

