import express from 'express';
import { addHeritageSite, deleteHeritageSite, getAllHeritageSites, getHeritageSiteById, getHeritageSiteImage, updateHeritageSite, } from '../controllers/adminHeritageSiteController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';
const router = express.Router();
// ==================== PUBLIC/PROTECTED HYBRID ROUTES ====================
// Use optionalAuthenticate to check if user has purchased the site
router.use(optionalAuthenticate);
// Public - Get all heritage sites
router.get('/getAllHeritageSites', getAllHeritageSites);
// Public - Get a single heritage site by ID
router.get('/:site_id', getHeritageSiteById);
// Public - Get heritage site image by ID
router.get('/:site_id/image', getHeritageSiteImage);
// ==================== PROTECTED ROUTES (Auth required) ====================
// All routes below require authentication
router.use(authenticate);
// ==================== ADMIN ROUTES ====================
// Admin only - Add a new heritage site with images
router.post('/addHeritageSite', upload.array('images', 5), addHeritageSite);
// Admin only - Update a heritage site with optional images
router.put('/:site_id', upload.array('images', 5), updateHeritageSite);
// Admin only - Delete a heritage site
router.delete('/:site_id', deleteHeritageSite);
export default router;
//# sourceMappingURL=adminHeritageSiteRoute.js.map