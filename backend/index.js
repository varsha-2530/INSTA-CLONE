import dotenv from "dotenv";
dotenv.config();

// Import dependencies
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

// Import routes and config
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { DATABASE_URI, PORT } from "./keys.js";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// app.use(cors({
//   origin: "https://insta-clone-1-frontend-88p4.onrender.com",
//   credentials: true,
// }));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174',
    'https://insta-clone-1-frontend-88p4.onrender.com' 
  ],
  credentials: true
}));


mongoose.connect(DATABASE_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.get("/api/health", (req, res) => {
  res.send("Everything working good 🚀");
});


app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});





