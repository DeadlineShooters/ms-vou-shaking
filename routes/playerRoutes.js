import express from "express";
import { getPlayerData } from "../controllers/playerController.js";  // Import the controller

const router = express.Router();

// Route to get player data by playerId
router.get("/player/:playerId", getPlayerData);

export default router;
