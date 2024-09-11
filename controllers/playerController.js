import { collection, doc, getDoc, addDoc, query, where, getDocs } from "firebase/firestore";
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

// Initialize FirebaseService instance
const firebaseService = new FirebaseService();

// Controller to get player data by ID
export const getPlayerData = async (req, res) => {
  const { playerId } = req.params;  // Get playerId from the request parameters

  try {
    // Fetch player data using FirebaseService
    const playerData = await firebaseService.getPlayer(playerId);

    // Send the fetched player data as a response
    res.status(200).json({
      username: playerData.username,
      plays: playerData.plays,
    });
  } catch (error) {
    console.error("Error fetching player data:", error.message);
    res.status(500).json({ message: "Error fetching player data", error: error.message });
  }
};
// Controller để lấy tất cả thông báo cho một Player
// Controller để lấy tất cả thông báo liên quan đến Play Requests của một Player
export const getNotifications = async (req, res) => {
    const { playerId } = req.params;
  
    try {
      // Step 1: Query notifications collection for unread notifications
      const notificationsRef = collection(firebaseService.firestore, 'notifications');
      const q = query(notificationsRef, where('recipientId', '==', playerId), where('isRead', '==', false));
      const snapshot = await getDocs(q);
  
      // Step 2: Format and return notifications
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      return res.status(200).json({ notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Controller để đánh dấu một thông báo là đã đọc
  export const dismissNotification = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notificationRef = doc(firebaseService.firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
  
      return res.status(200).json({ message: "Notification dismissed" });
    } catch (error) {
      console.error('Error dismissing notification:', error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };