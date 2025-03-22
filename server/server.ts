import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect";
import userRoutes from './routes/userRoutes';

const app = express();

// CORS Configuration - Explicitly disable WebSocket
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
    // Explicitly define allowed headers
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware
app.use(express.json());

app.use('/api/users', userRoutes);

// Add a test route to check basic functionality
app.get('/', (req, res) => {
  res.send('Server is running correctly');
});

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    
    // Use regular Express server instead of HTTP createServer
    app.listen(3001, "0.0.0.0", () => {
      console.log("Server running on http://localhost:3001");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();