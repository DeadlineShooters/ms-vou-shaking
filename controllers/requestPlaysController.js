import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService
// Controller for Player A to request plays from Player B
export const requestPlays = async (req, res) => {
  const { playerAId, playerBId } = req.body;  // Get Player A (requester) and Player B (responder) IDs

  try {
    // Step 1: Fetch Player B's data to ensure they exist
    const playerBRef = doc(firebaseService.firestore, 'players', playerBId);
    const playerBSnap = await getDoc(playerBRef);

    if (!playerBSnap.exists()) {
      return res.status(404).json({ message: "Player B not found" });
    }

    // Step 2: Create a request notification for Player B
    const notificationsCollection = collection(firebaseService.firestore, 'notifications');
    const notificationMessage = `Player A has requested plays from you. Do you accept?`;

    await addDoc(notificationsCollection, {
      recipientId: playerBId,  // Send the notification to Player B
      senderId: playerAId,  // Player A is the requester
      message: notificationMessage,
      requestType: 'play_request',
      timestamp: new Date(),
      isRead: false,
      status: 'pending'  // The status is pending until Player B responds
    });

    return res.status(200).json({ message: 'Play request sent to Player B!' });
    
  } catch (error) {
    console.error("Error handling play request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
