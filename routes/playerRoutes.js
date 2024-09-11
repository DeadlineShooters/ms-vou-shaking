import express from "express";
import { getPlayerData } from "../controllers/playerController.js";  // Import the controller
import { getNotifications } from "../controllers/playerController.js";
import { dismissNotification } from "../controllers/playerController.js";
const router = express.Router();

// Route to get player data by playerId
router.get("/player/:playerId", getPlayerData);
router.get('/player/notifications/:playerId', getNotifications);  // Lấy thông báo cho Player A
router.post('/player/notifications/:notificationId/dismiss', dismissNotification);  // Đánh dấu thông báo đã đọc
export default router;
