import express from "express";
import dotenv from "dotenv";
import connectDB from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import readingRoute from "./routes/readingRoute.js";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());

//public routes
app.use("/api/auth", authRoute);
app.use("/api/reading", readingRoute);

//private routes
app.use(protectedRoute); // middleware xác thực JWT
app.use("/api/users", userRoute);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
