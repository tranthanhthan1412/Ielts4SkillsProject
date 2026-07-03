import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./libs/db.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/health", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    server: "running",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
