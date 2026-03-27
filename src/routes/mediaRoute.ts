import express from 'express';
import {
  getStoryImage,
  getHeritageSiteAdditionalImage,
  getMuseumAdditionalImage,
  getUserProfileImage
} from '../controllers/mediaController.js';
import { getHeritageSiteImage } from '../controllers/adminHeritageSiteController.js';
import { getMuseumImage } from '../controllers/museumController.js';

const router = express.Router();

// Story main image
router.get('/stories/:story_id/image', getStoryImage);

// Heritage Site main image
router.get('/heritage-sites/:site_id/image', getHeritageSiteImage);

// Heritage Site additional images
router.get('/heritage-sites/image/:image_id', getHeritageSiteAdditionalImage);

// Museum main image
router.get('/sites/:site_id/image', getHeritageSiteImage);
router.get('/sites/additional/:image_id', getHeritageSiteAdditionalImage);

// Museum images
router.get('/museums/:museum_id/image', getMuseumImage);
router.get('/museums/additional/:image_id', getMuseumAdditionalImage);

// User profile image
router.get('/users/:user_id/image', getUserProfileImage);

export default router;
