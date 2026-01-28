import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import deleteResolvedFeedbacks from './utils/cleanupResolvedFeedbacks.js';

deleteResolvedFeedbacks();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Educational Materials API');
});

app.use('/api/auth', authRoutes);

app.use('/api/materials', materialRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/feedbacks", feedbackRoutes);

app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




