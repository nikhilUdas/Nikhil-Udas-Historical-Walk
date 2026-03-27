import express from 'express';
import { getFullStory, getStoriesPreview, getStoriesPreviewBySite, getStoryPreviewById, } from '../controllers/storyController.js';
import { authenticate } from '../middleware/auth.js';
import { optionalAuthenticate } from '../middleware/auth.js';
const router = express.Router();
// Public routes (no authentication required) - Free previews
// Identify user if logged in to show unlocked status
router.get('/preview', optionalAuthenticate, getStoriesPreview);
router.get('/preview/:story_id', optionalAuthenticate, getStoryPreviewById);
router.get('/preview/site/:site_id', optionalAuthenticate, getStoriesPreviewBySite);
// Protected route - Full story content (requires authentication/purchase)
router.get('/full/:story_id', authenticate, getFullStory);
export default router;
//# sourceMappingURL=storyRoute.js.map