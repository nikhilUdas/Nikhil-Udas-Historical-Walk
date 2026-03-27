import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { addStory, updateStory, deleteStory, getAllStories, getStoryById, } from '../controllers/adminStoryController.js';
import { upload } from '../utils/fileUpload.js';
const router = express.Router();
// All routes require authentication
router.use(authenticate);
// Story management routes
router.get('/', getAllStories); // GET /api/admin/stories
router.post('/addStory', upload.single('media'), addStory); // POST /api/admin/stories
router.get('/:story_id', getStoryById); // GET /api/admin/stories/:story_id
router.put('/:story_id', upload.single('media'), updateStory); // PUT /api/admin/stories/:story_id
router.delete('/:story_id', deleteStory); // DELETE /api/admin/stories/:story_id
export default router;
//# sourceMappingURL=adminStoryRoute.js.map