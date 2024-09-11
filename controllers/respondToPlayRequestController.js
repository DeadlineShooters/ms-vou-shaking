import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService
// Controller for Player B to accept or reject the play request
export const respondToPlayRequest = async (req, res) => {
  const { playerBId, playerAId, response } = req.body;  // Get Player B, Player A, and response (accept/reject)

  try {
    // Step 1: Fetch Player A's data
    const playerARef = doc(firebaseService.firestore, 'players', playerAId);
    const playerASnap = await getDoc(playerARef);

    if (!playerASnap.exists()) {
      return res.status(404).json({ message: 'Player A not found' });
    }

    const playerAData = playerASnap.data();
    let newPlays = playerAData.plays;

    // Step 2: Handle the response (accept or reject)
    if (response === 'accept') {
      // Step 3: Add 3 plays to Player A if Player B accepts the request
      newPlays += 3;

      // Update Player A's plays in Firestore
      await updateDoc(playerARef, { plays: newPlays });

      // Create notification for Player A
      const notificationMessage = `Player B accepted your play request! You now have 3 additional plays.`;
      await sendNotification(playerAId, notificationMessage);
      
      return res.status(200).json({
        message: "Play request accepted, Player A has been given 3 plays!",
        updatedPlays: newPlays
      });

    } else {
      // Player B rejected the request
      const notificationMessage = `Player B rejected your play request.`;
      await sendNotification(playerAId, notificationMessage);

      return res.status(200).json({
        message: "Play request rejected.",
        updatedPlays: playerAData.plays  // No change in Player A's plays
      });
    }

  } catch (error) {
    console.error("Error responding to play request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to send notification
const sendNotification = async (recipientId, message) => {
  const notificationsCollection = collection(firebaseService.firestore, 'notifications');
  await addDoc(notificationsCollection, {
    recipientId: recipientId,  // Player A will receive the notification
    message: message,
    timestamp: new Date(),
    isRead: false  // Notification is unread by default
  });
};
