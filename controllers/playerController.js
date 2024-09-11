import FirebaseService from "../services/FirebaseService.js";

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
