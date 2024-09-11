// app.js
import express from 'express';
import playerRoutes from "./routes/playerRoutes.js";  // Import the new route
import bodyParser from 'body-parser';
import shakeRoutes from './routes/shakeRoutes.js';  // Import the shake routes
import exchangeRoutes from './routes/exchangeRoutes.js';
import sendItemRoutes from './routes/sendItemRoutes.js';
import playRoutes from './routes/playRoutes.js'; 
import shareRoutes from './routes/shareRoutes.js';  // Import the share route
import inventoryRoutes from './routes/inventoryRoutes.js';
import cors from "cors";  // Import the cors package
const app = express();
app.use(bodyParser.json());  // Parse JSON bodies
app.use(cors());  // This will allow requests from any origin
app.use('/api/shake', shakeRoutes);  // Pass db (Firestore instance) to routes
app.use('/api/exchange', exchangeRoutes);
app.use('/api/sendItem', sendItemRoutes);
app.use('/api', shareRoutes);  // Add the new route for sharing on Facebook
app.use('/api', playRoutes);  // Add the play routes
app.use("/api", playerRoutes);
app.use("/api", inventoryRoutes);
// Default route for testing the server
app.get("/", (req, res) => {
  res.send("Server is running securely on HTTPS!");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

