// app.js
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import shakeRoutes from './routes/shakeRoutes.js';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/shake', shakeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
