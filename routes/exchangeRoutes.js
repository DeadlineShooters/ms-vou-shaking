// src/routes/exchangeRoutes.js
import { Router } from "express";
import { handleExchangeAction } from "../controllers/handleExchangeAction.js";

const router = Router();

router.post("/", handleExchangeAction);  // Define the route for exchanging items

export default router;
