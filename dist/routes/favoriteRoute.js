import express from 'express';
import { toggleFavorite, getUserFavorites } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
// Toggle favorite status for a heritage site (requires auth)
router.post('/toggle/:site_id', authenticate, toggleFavorite);
// Get all favorite sites for the authenticated user (requires auth)
router.get('/', authenticate, getUserFavorites);
export default router;
//# sourceMappingURL=favoriteRoute.js.map