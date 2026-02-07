import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';
import { addHeritageSite, updateHeritageSite, deleteHeritageSite, getAllHeritageSites, getHeritageSiteById, getHeritageSiteImage, } from '../controllers/adminHeritageSiteController.js';
const router = express.Router();
// ==================== PUBLIC ROUTES (No auth required) ====================
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
// Admin only - Add a new heritage site with image
router.post('/addHeritageSite', upload.single('image'), addHeritageSite);
// Admin only - Update a heritage site with optional image
router.put('/:site_id', upload.single('image'), updateHeritageSite);
// Admin only - Delete a heritage site
router.delete('/:site_id', deleteHeritageSite);
export default router;
//# sourceMappingURL=adminHeritageSiteRoute.js.map