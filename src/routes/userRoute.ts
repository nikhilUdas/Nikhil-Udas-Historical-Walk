import express from "express";
import {
    deleteReview,
    getAllReviews,
    getReviewSummary,
    getUserReviews,
    submitReview,
} from "../controllers/reviewController.js";
import {
    forgotPassword,
    getUserProfile,
    login,
    registerUser,
    resendOTP,
    resetPassword,
    updateUserProfile,
    verifyOTP,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../utils/fileUpload.js";

const router = express.Router();

const profileUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

// Public routes
router.post(
  "/register",
  (req, res, next) => {
    // Router middleware for POST /register
    next();
  },
  registerUser,
);

router.post("/resend-otp", resendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// Forgot Password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Review routes
router.post("/reviews", authenticate, upload.single("image"), submitReview); // Submit/Update review (requires auth)
router.get("/reviews", getAllReviews); // Get all reviews across all museums (public)
router.get("/reviews/summary", getReviewSummary); // Get review summary for museum or site (public)
router.get("/reviews/museum/:museum_id", getReviewSummary); // Get museum reviews (public) - legacy route
router.get("/reviews/my-reviews", authenticate, getUserReviews); // Get user's reviews (requires auth)
router.delete("/reviews/:review_id", authenticate, deleteReview); // Delete review (requires auth)

// Protected routes (require authentication)
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, profileUpload, updateUserProfile);
router.patch("/profile", authenticate, profileUpload, updateUserProfile);

export default router;
