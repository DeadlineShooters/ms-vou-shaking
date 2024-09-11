// src/routes/shakeRoutes.js
import { Router } from 'express';
import { handleShakeAction } from '../controllers/shakeControllers.js';  // Import the controller

const router = Router();

// POST request to /api/shake to perform shake action
router.post('/', handleShakeAction);  // Call the controller directly

export default router;
