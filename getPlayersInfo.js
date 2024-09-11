// src/testGetPlayers.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Initialize Firestore

// Function to get players from Firestore
const getPlayers = async () => {
  try {
    // Access the 'players' collection
    const querySnapshot = await getDocs(collection(db, "players"));

    // Check if there are any players
    if (querySnapshot.empty) {
      console.log('No players found.');
    } else {
      // Loop through each player document and log the data
      querySnapshot.forEach((doc) => {
        console.log(`Player ID: ${doc.id}, Player Data: ${JSON.stringify(doc.data())}`);
      });
    }
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

// Run the test function
getPlayers();
