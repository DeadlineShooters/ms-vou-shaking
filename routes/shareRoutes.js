import express from 'express';
import { handleShareOnFacebook } from '../controllers/shareOnFacebookController.js';  // Import the controller

const router = express.Router();

// POST request to /api/share-facebook to add 5 plays after sharing
router.post('/share-facebook', handleShareOnFacebook);

export default router;
