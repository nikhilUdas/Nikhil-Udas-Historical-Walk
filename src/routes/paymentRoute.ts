import express from 'express';
import { getAllPaymentHistory, getPaymentHistory, initiateEsewa, initiateKhalti, initiateSiteEsewa, initiateSiteKhalti, initiateStoryEsewa, initiateStoryKhalti, verifyEsewa, verifyKhalti, verifySiteEsewa, verifySiteKhalti, verifyStoryEsewa, verifyStoryKhalti } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// History routes
router.get('/history', getPaymentHistory);
router.get('/admin/all', getAllPaymentHistory);

router.post('/initiate', initiateKhalti);
router.post('/verify', verifyKhalti);
router.post('/esewa/initiate', initiateEsewa);
router.post('/esewa/verify', verifyEsewa);

// Story Payments
router.post('/story/khalti/initiate', initiateStoryKhalti);
router.post('/story/khalti/verify', verifyStoryKhalti);
router.post('/story/esewa/initiate', initiateStoryEsewa);
router.post('/story/esewa/verify', verifyStoryEsewa);

// Site Payments
router.post('/site/khalti/initiate', initiateSiteKhalti);
router.post('/site/khalti/verify', verifySiteKhalti);
router.post('/site/esewa/initiate', initiateSiteEsewa);
router.post('/site/esewa/verify', verifySiteEsewa);

export default router;
