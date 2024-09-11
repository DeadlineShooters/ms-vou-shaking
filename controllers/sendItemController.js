import { collection, query, where, getDocs, getDoc, updateDoc, addDoc } from "firebase/firestore";  // Import necessary methods
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();  // Initialize FirebaseService
// Fetch recipient by username from the players collection
export const handleSendItemAction = async (req, res) => {
    const { senderId, item, recipientUsername } = req.body;  // Get senderId, recipientUsername, and item from the request
  
    try {
      // Step 1: Fetch the sender's inventory document
      const senderData = await firebaseService.getPlayer(senderId);
      const senderInventoryRef = senderData.inventory;
      const senderInventorySnap = await getDoc(senderInventoryRef);
  
      if (!senderInventorySnap.exists()) {
        return res.status(404).json({ message: "Sender's inventory not found" });
      }
  
      const senderInventoryData = senderInventorySnap.data();
  
      // Step 2: Check if the sender has enough of the selected item
      if (senderInventoryData.items[item]?.amount < 1) {
        return res.status(400).json({ message: "Sender does not have enough items" });
      }
  
      // Step 3: Find the recipient by their username
      const playersCollection = collection(firebaseService.firestore, 'players');
      const recipientQuery = query(playersCollection, where('username', '==', recipientUsername));
      const recipientSnap = await getDocs(recipientQuery);
  
      if (recipientSnap.empty) {
        return res.status(404).json({ message: "Recipient not found" });
      }
  
      const recipientDoc = recipientSnap.docs[0];
      const recipientData = recipientDoc.data();
      const recipientInventoryRef = recipientData.inventory;
      const recipientInventorySnap = await getDoc(recipientInventoryRef);
  
      if (!recipientInventorySnap.exists()) {
        return res.status(404).json({ message: "Recipient's inventory not found" });
      }
  
      const recipientInventoryData = recipientInventorySnap.data();
  
      // Step 4: Deduct the item from the sender's inventory
      const updatedSenderItemAmount = Math.max(0, senderInventoryData.items[item].amount - 1);
      await updateDoc(senderInventoryRef, {
        [`items.${item}.amount`]: updatedSenderItemAmount
      });
  
      // Step 5: Add the item to the recipient's inventory
      const updatedRecipientItemAmount = (recipientInventoryData.items[item]?.amount || 0) + 1;
      await updateDoc(recipientInventoryRef, {
        [`items.${item}.amount`]: updatedRecipientItemAmount
      });
  
      // Step 6: Create a notification for the recipient
      const notificationsCollection = collection(firebaseService.firestore, 'notifications');  // Use 'notifications' collection
      const notificationMessage = `You received a gift of ${item} from ${senderData.username}`;
      await addDoc(notificationsCollection, {
        recipientId: recipientDoc.id,  // ID of the recipient player
        message: notificationMessage,  // Notification message
        senderId: senderId,  // ID of the sender
        timestamp: new Date(),  // The time of the notification
        isRead: false  // Mark as unread by default
      });
  
      // Step 7: Respond with success, updated inventories, and notification details
      return res.status(200).json({
        message: "Item sent successfully and notification sent to the recipient",
        updatedSenderInventory: {
          [item]: updatedSenderItemAmount
        },
        updatedRecipientInventory: {
          [item]: updatedRecipientItemAmount
        },
        notification: {
          message: notificationMessage,
          recipient: recipientData.username
        }
      });
  
    } catch (error) {
      console.error("Error handling send item action:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
