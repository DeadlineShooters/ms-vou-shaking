// src/routes/sendItemRoutes.js
import { Router } from "express";
import { handleSendItemAction } from "../controllers/sendItemController.js";

const router = Router();

router.post("/", handleSendItemAction);  // Define the route for sending an item

export default router;
