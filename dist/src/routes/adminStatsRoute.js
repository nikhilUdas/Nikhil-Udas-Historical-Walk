import { Router } from 'express';
import { getAdminStats } from '../controllers/adminStatsController.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
// Get admin dashboard stats
router.get('/', authenticate, getAdminStats);
export default router;
//# sourceMappingURL=adminStatsRoute.js.map