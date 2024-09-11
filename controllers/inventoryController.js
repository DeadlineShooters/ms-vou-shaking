import FirebaseService from "../services/FirebaseService.js";
import { getDoc } from "firebase/firestore";

// Initialize FirebaseService instance
const firebaseService = new FirebaseService();

// Controller to get player inventory by ID
export const getPlayerInventory = async (req, res) => {
  const { playerId } = req.params;  // Get playerId from request parameters

  try {
    // Fetch player data using FirebaseService
    const playerData = await firebaseService.getPlayer(playerId);

    // Fetch player's inventory using the inventory reference
    const inventoryRef = playerData.inventory;  // This is a Firestore document reference
    const inventorySnap = await getDoc(inventoryRef);  // Get the inventory document snapshot

    if (!inventorySnap.exists()) {
      return res.status(404).json({ message: "Inventory not found for the player" });
    }

    const inventoryData = inventorySnap.data();  // Get inventory data

    // Send the fetched inventory data as a response
    res.status(200).json({
      items: inventoryData.items,  // Assuming inventory has an 'items' field
    });
  } catch (error) {
    console.error("Error fetching player inventory:", error.message);
    res.status(500).json({ message: "Error fetching player inventory", error: error.message });
  }
};
