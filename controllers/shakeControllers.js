import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service
import { getDoc } from "firebase/firestore";  // Import Firestore functions for handling documents

const firebaseService = new FirebaseService();  // Initialize FirebaseService

// Controller for handling the shake action
export const handleShakeAction = async (req, res) => {
  const { playerId, item } = req.body;  // Get playerId and item from the request

  try {
    // Step 1: Fetch the player document using FirebaseService
    const playerData = await firebaseService.getPlayer(playerId);  // Get player data
    const inventoryRef = playerData.inventory;  // This is a DocumentReference object

    // Step 2: Fetch the player's inventory document
    const inventorySnap = await getDoc(inventoryRef);  // Fetch the inventory document

    if (!inventorySnap.exists()) {
      return res.status(404).json({ message: 'Inventory not found for player' });
    }

    const inventoryData = inventorySnap.data();
    const updatedItemAmount = (inventoryData.items[item]?.amount || 0) + 1;

    // Step 3: Update the player's plays and inventory
    await firebaseService.updatePlayer(
      playerId,
      playerData.plays - 1,   // Reduce plays by 1
      inventoryRef.id,        // Use the correct inventory document reference
      item,
      updatedItemAmount
    );

    // Step 4: Respond with success and updated player data
    return res.status(200).json({
      message: 'Shake successful',
      remainingPlays: playerData.plays - 1,
      updatedInventory: {
        [item]: { amount: updatedItemAmount }
      }
    });

  } catch (error) {
    console.error('Error handling shake:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
