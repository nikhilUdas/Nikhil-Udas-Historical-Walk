import express from 'express';
import { getAllHeritageSites, getHeritageSiteById, getHeritageSiteImage, } from '../controllers/adminHeritageSiteController.js';
const router = express.Router();
// ==================== PUBLIC ROUTES (No auth required) ====================
// Public - Get all heritage sites
router.get('/getAllHeritageSites', getAllHeritageSites);
// Public - Get a single heritage site by ID
router.get('/:site_id', getHeritageSiteById);
// Public - Get heritage site image by ID
router.get('/:site_id/image', getHeritageSiteImage);
export default router;
//# sourceMappingURL=heritageSiteRoute.js.map