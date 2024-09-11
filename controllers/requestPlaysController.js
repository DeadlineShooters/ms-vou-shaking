import { collection, doc, getDoc, addDoc, query, where, getDocs } from "firebase/firestore";
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService

// Controller for Player A to request plays from Player B using Player B's username
export const requestPlays = async (req, res) => {
  const { playerAId, playerBUsername } = req.body;  // Get Player A (requester) ID and Player B (responder) username

  try {
    // Step 1: Search for Player B by username
    const playersCollection = collection(firebaseService.firestore, 'players');
    const playerBQuery = query(playersCollection, where('username', '==', playerBUsername));
    const playerBQuerySnapshot = await getDocs(playerBQuery);

    if (playerBQuerySnapshot.empty) {
      return res.status(404).json({ message: "Player B not found" });
    }

    // Assuming username is unique, get the first matching player
    const playerBDoc = playerBQuerySnapshot.docs[0];
    const playerBData = playerBDoc.data();
    const playerBId = playerBDoc.id;  // Extract Player B's ID

    // Step 2: Create a notification for Player B
    const notificationsCollection = collection(firebaseService.firestore, 'notifications');
    const notificationMessage = `Player A has requested plays from youdddsa. Do you accept?`;

    await addDoc(notificationsCollection, {
      recipientId: playerBId,  // Send the notification to Player B
      senderId: playerAId,     // Player A is the requester
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
