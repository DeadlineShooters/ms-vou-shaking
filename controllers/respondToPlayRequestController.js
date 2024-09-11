import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import FirebaseService from "../services/FirebaseService.js";  // Import Firebase service

const firebaseService = new FirebaseService();

// Controller để Player B phản hồi yêu cầu
export const respondToPlayRequest = async (req, res) => {
  const {  playerAId, response } = req.body;  // Get Player B, Player A, và phản hồi (accept/decline)

  try {
    // Lấy thông tin của Player A từ Firestore
    const playerARef = doc(firebaseService.firestore, 'players', playerAId);
    const playerASnap = await getDoc(playerARef);

    if (!playerASnap.exists()) {
      return res.status(404).json({ message: "Player A not found" });
    }

    const playerAData = playerASnap.data();
    let newPlays = playerAData.plays;

    let notificationMessage;

    if (response === 'accept') {
      // Nếu Player B chấp nhận yêu cầu, cộng thêm 3 lượt chơi cho Player A
      newPlays += 3;
      await updateDoc(playerARef, { plays: newPlays });

      // Tạo thông báo cho Player A
      notificationMessage = `Player B accepted your play request! You now have 3 additional plays.`;

    } else {
      // Nếu Player B từ chối yêu cầu
      notificationMessage = `Player B declined your play request.`;
    }

    // Tạo thông báo trong Firestore cho Player A
    await addDoc(collection(firebaseService.firestore, 'notifications'), {
      playerId: playerAId,
      message: notificationMessage,
      timestamp: new Date(),
      isRead: false  // Thông báo chưa được đọc
    });

    return res.status(200).json({
      message: `Play request ${response}ed successfully!`,
      updatedPlays: newPlays
    });

  } catch (error) {
    console.error("Error responding to play request:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
