// app.js
import express from 'express';

import bodyParser from 'body-parser';
import shakeRoutes from './routes/shakeRoutes.js';  // Import the shake routes
import exchangeRoutes from './routes/exchangeRoutes.js';
import sendItemRoutes from './routes/sendItemRoutes.js';
import playRoutes from './routes/playRoutes.js'; 
import shareRoutes from './routes/shareRoutes.js';  // Import the share route
const app = express();
app.use(bodyParser.json());  // Parse JSON bodies

app.use('/api/shake', shakeRoutes);  // Pass db (Firestore instance) to routes
app.use('/api/exchange', exchangeRoutes);
app.use('/api/sendItem', sendItemRoutes);
app.use('/api', shareRoutes);  // Add the new route for sharing on Facebook
app.use('/api', playRoutes);  // Add the play routes
// Default route for testing the server
app.get("/", (req, res) => {
  res.send("Server is running securely on HTTPS!");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

