import { doc, getDoc, updateDoc } from "firebase/firestore";  // Import necessary methods
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService
// Controller to handle the "Share on Facebook" action
export const handleShareOnFacebook = async (req, res) => {
  const { playerId } = req.body;  // Get playerId from the request

  try {
    // Step 1: Fetch the player's data from Firestore
    const playerRef = doc(firebaseService.firestore, 'players', playerId);  // Get player document reference
    const playerSnap = await getDoc(playerRef);  // Fetch the player document

    if (!playerSnap.exists()) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const playerData = playerSnap.data();

    // Step 2: Check if the user has 0 plays
    if (playerData.plays === 0) {
      // Step 3: Add 5 plays to the user's current plays
      const newPlays = playerData.plays + 5;

      // Step 4: Update the player document in Firestore
      await updateDoc(playerRef, { plays: newPlays });

      // Step 5: Respond with success and the updated number of plays
      return res.status(200).json({
        message: 'Share successful, 5 plays added!',
        updatedPlays: newPlays
      });
    } else {
      // User already has plays, so don't add more
      return res.status(400).json({ message: 'You still have plays remaining!' });
    }

  } catch (error) {
    console.error('Error handling Facebook share:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
