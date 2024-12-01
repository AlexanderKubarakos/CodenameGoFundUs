import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB with retry logic
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectMongoDB, 5000);  // Retry after 5 seconds
  }
};

connectMongoDB();

// Use Routes
app.use('/api/user', userRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/request', requestRoutes);

// Graceful Shutdown Handler
process.on('SIGINT', () => {
  console.log("Shutting down the server...");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Something went wrong", details: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
