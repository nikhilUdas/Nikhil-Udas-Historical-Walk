import express from 'express';
import { registerUser, resendOTP, verifyOTP, login, getUserProfile, updateUserProfile, forgotPassword, resetPassword, } from '../controllers/userController.js';
import { submitReview, getReviewSummary } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
// Public routes
router.post('/register', (req, res, next) => {
    // Router middleware for POST /register
    next();
}, registerUser);
router.post('/resend-otp', resendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
// Forgot Password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Review routes (public)
router.post('/reviews', submitReview);
router.get('/reviews/:type/:id/summary', getReviewSummary);
// Protected routes (require authentication)
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
export default router;
//# sourceMappingURL=userRoute.js.map