import express from 'express';
import { getMyTickets, verifyTicketQR } from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/my-tickets', getMyTickets);
router.post('/verify-qr', verifyTicketQR);
export default router;
//# sourceMappingURL=ticketRoute.js.map