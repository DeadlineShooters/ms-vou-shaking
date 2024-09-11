// src/routes/inventoryRoutes.js
import express from "express";
import { getPlayerInventory } from "../controllers/inventoryController.js";

const router = express.Router();

// Route to get player's inventory by playerId
router.get("/player/:playerId/inventory", getPlayerInventory);

export default router;
