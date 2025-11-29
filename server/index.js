import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import storyRoute from './routes/storyRoute.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();

// DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://liflect.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', storyRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
