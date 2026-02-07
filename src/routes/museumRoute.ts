import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../utils/fileUpload.js';
import {
  addMuseum,
  updateMuseum,
  deleteMuseum,
  getAllMuseums,
  getMuseumById,
  getMuseumImage,
  purchaseTicket,
  getUserTickets,
  getTicketById,
} from '../controllers/museumController.js';

const router = express.Router();

// ==================== PUBLIC ROUTES (No auth required) ====================

// Public - Get all museums
router.get('/getMuseum', getAllMuseums);

// Public - Get a single museum by ID
router.get('/:museum_id', getMuseumById);

// Public - Get museum image by ID
router.get('/:museum_id/image', getMuseumImage);

// ==================== PROTECTED ROUTES (Auth required) ====================

// Apply authentication to all routes below
router.use(authenticate);

// ==================== ADMIN ROUTES ====================

// Admin only - Add a new museum with image
router.post('/admin/add', upload.single('image'), addMuseum);

// Admin only - Update a museum with optional image
router.put('/admin/:museum_id', upload.single('image'), updateMuseum);

// Admin only - Delete a museum
router.delete('/admin/:museum_id', deleteMuseum);

// ==================== USER ROUTES ====================

// User only - Purchase a ticket
router.post('/tickets/purchase', purchaseTicket);

// User only - Get all user's tickets
router.get('/tickets/my-tickets', getUserTickets);

// User only - Get a single ticket by ID
router.get('/tickets/:ticket_id', getTicketById);

export default router;