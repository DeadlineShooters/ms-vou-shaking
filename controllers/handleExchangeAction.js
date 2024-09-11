// src/controllers/exchangeController.js
import { getDoc, updateDoc } from "firebase/firestore";
import {  } from "firebase/firestore";  // Import needed methods

import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService

export const handleExchangeAction = async (req, res) => {
  const { playerId, selectedItems } = req.body;  // Get playerId and selected items from the request
  const { cat = 0, panda = 0, rabbit = 0 } = selectedItems;  // Default to 0 if not provided

  try {
    // Step 1: Fetch the player's inventory document
    const playerData = await firebaseService.getPlayer(playerId);
    const inventoryRef = playerData.inventory;  // This is a DocumentReference
    const inventorySnap = await getDoc(inventoryRef);

    if (!inventorySnap.exists()) {
      return res.status(404).json({ message: "Inventory not found for player" });
    }

    const inventoryData = inventorySnap.data();

    // Step 2: Check if the player has enough items to complete the exchange
    if (inventoryData.items.cat < cat || inventoryData.items.panda < panda || inventoryData.items.rabbit < rabbit) {
      return res.status(400).json({ message: "Insufficient items in inventory" });
    }

    // Step 3: Deduct the exchanged items from the inventory
    const updatedInventory = {
      cat: inventoryData.items.cat - cat,
      panda: inventoryData.items.panda - panda,
      rabbit: inventoryData.items.rabbit - rabbit
    };

    // Update the inventory in Firestore
    await updateDoc(inventoryRef, {
      "items.cat": updatedInventory.cat,
      "items.panda": updatedInventory.panda,
      "items.rabbit": updatedInventory.rabbit
    });

    // Step 4: Generate a voucher (For simplicity, we return a mock voucher code here)
    const voucherCode = `VOUCHER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Step 5: Respond with the voucher code and updated inventory
    return res.status(200).json({
      message: "Exchange successful",
      voucher: voucherCode,
      updatedInventory
    });

  } catch (error) {
    console.error("Error handling exchange:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
