import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import storyRoute from './routes/storyRoute.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/userRoute.js'; // <-- Good!

dotenv.config();

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static('public')); 

// Routes
app.use('/api', storyRoute);           // Story routes
app.use('/api/auth', authRoute);       // Login / Signup
app.use('/api/user', userRoute);       // <-- ADD THIS LINE

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
