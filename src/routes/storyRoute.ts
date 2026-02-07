import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getStoriesPreview,
  getStoryPreviewById,
  getStoriesPreviewBySite,
  getFullStory,
} from '../controllers/storyController.js';

const router = express.Router();

// Public routes (no authentication required) - Free previews
router.get('/preview', getStoriesPreview);
router.get('/preview/:story_id', getStoryPreviewById);
router.get('/preview/site/:site_id', getStoriesPreviewBySite);

// Protected route - Full story content (requires authentication/purchase)
router.get('/full/:story_id', authenticate, getFullStory);

export default router;
