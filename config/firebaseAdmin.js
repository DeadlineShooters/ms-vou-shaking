// src/config/firebaseAdmin.js

import admin from "firebase-admin";
import { firebaseConf } from "../config-firebase.js";  // Ensure you have proper credentials in firebaseConf

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(firebaseConf),
  projectId: process.env.PROJECT_ID,  // Your project ID
});

const db = admin.firestore();  // Get Firestore instance from Admin SDK

export { firebaseAdmin, db };  // Export both admin and Firestore instance
