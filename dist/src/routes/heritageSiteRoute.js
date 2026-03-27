import express from 'express';
import { getAllHeritageSites, getHeritageSiteById, getHeritageSiteImage, } from '../controllers/adminHeritageSiteController.js';
import { optionalAuthenticate } from '../middleware/auth.js';
const router = express.Router();
// ==================== PUBLIC ROUTES (No auth required) ====================
// Note: optionalAuthenticate is used to identify the user if they are logged in,
// but doesn't block guests. This allows checking for purchased sites.
// Public - Get all heritage sites
router.get('/getAllHeritageSites', optionalAuthenticate, getAllHeritageSites);
// Public - Get a single heritage site by ID
router.get('/:site_id', optionalAuthenticate, getHeritageSiteById);
// Public - Get heritage site image by ID
router.get('/:site_id/image', getHeritageSiteImage);
export default router;
//# sourceMappingURL=heritageSiteRoute.js.map