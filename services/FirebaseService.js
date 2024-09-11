// src/services/FirebaseService.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4fbFucQyEXNIMdfTaL_e_cRUylwPC3Mc",
  authDomain: "vou-microservices.firebaseapp.com",
  projectId: "vou-microservices",
  storageBucket: "vou-microservices.appspot.com",
  messagingSenderId: "140526639115",
  appId: "1:140526639115:web:662bc17a4fba53af1dcf0e",
  measurementId: "G-09XFSPH2KY",
};

// Initialize Firebase using the client SDK
export default class FirebaseService {
  constructor() {
    this.app = initializeApp(firebaseConfig);  // Initialize Firebase app
    this.auth = getAuth(this.app);             // Initialize Firebase Auth
    this.firestore = getFirestore(this.app);   // Initialize Firestore
  }

  // Get player data by playerId from Firestore
  async getPlayer(playerId) {
    const playerRef = doc(this.firestore, "players", playerId);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
      return playerSnap.data();  // Return player data
    } else {
      throw new Error("Player not found");
    }
  }

  // Update player's plays and inventory
  async updatePlayer(playerId, plays, inventoryId, item, updatedItemAmount) {
    const playerRef = doc(this.firestore, "players", playerId);
    const inventoryRef = doc(this.firestore, "invetory", inventoryId);

    // Update player's plays
    await updateDoc(playerRef, { plays: plays });

    // Update inventory for the player
    await updateDoc(inventoryRef, {
      [`items.${item}.amount`]: updatedItemAmount
    });
  }
}
