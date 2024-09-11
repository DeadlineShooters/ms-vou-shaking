// routes/shakeRoutes.js
import { Router } from 'express';
import { startShake, getMoreAttempts } from '../controllers/shakeControllers.js';

const router = Router();

router.post('/start', startShake);
router.post('/get-more-attempts', getMoreAttempts);

export default router;
