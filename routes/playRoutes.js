import express from 'express';
import { requestPlays } from '../controllers/requestPlaysController.js';
import { respondToPlayRequest } from '../controllers/respondToPlayRequestController.js';

const router = express.Router();

// Player A requests plays from Player B
router.post('/request-plays', requestPlays);

// Player B accepts or rejects the play request
router.post('/respond-request', respondToPlayRequest);

export default router;
