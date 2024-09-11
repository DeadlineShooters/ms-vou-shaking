// controllers/shakeController.js
import { db } from '../config/firebase.js';
import Player from '../models/Player.js';

export const startShake = async (req, res) => {
  const { userId } = req.body;

  try {
    const player = new Player(userId);
    const playerInfo = await player.getPlayerInfo();

    if (playerInfo.remainingPlays > 0) {
      // Randomly pick an item
      const items = ["Sword", "Shield", "Potion"]; // Replace with your items
      const randomItem = items[Math.floor(Math.random() * items.length)];

      // Update remaining plays
      await player.updateRemainingPlays(playerInfo.remainingPlays - 1);

      // Respond with the item
      return res.status(200).json({ item: randomItem });
    } else {
      return res.status(400).json({ message: "No plays remaining" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMoreAttempts = async (req, res) => {
  const { userId, method } = req.body; // method can be "friendRequest" or "facebookShare"

  try {
    const player = new Player(userId);
    const playerInfo = await player.getPlayerInfo();

    let additionalPlays = 0;
    if (method === "facebookShare") {
      additionalPlays = 1; // Add 1 play for Facebook share
    } else if (method === "friendRequest") {
      additionalPlays = 2; // Add 2 plays for friend requests
    }

    await player.updateRemainingPlays(playerInfo.remainingPlays + additionalPlays);

    return res.status(200).json({ message: `You received ${additionalPlays} extra plays!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
