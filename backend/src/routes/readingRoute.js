import express from "express";
import {
  getReadingAttempt,
  getReadingTest,
  listReadingTests,
  submitReadingAttempt,
} from "../controllers/readingController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/tests", listReadingTests);
router.get("/tests/:slug", getReadingTest);
router.post("/tests/:slug/attempts", protectedRoute, submitReadingAttempt);
router.get("/attempts/:attemptId", protectedRoute, getReadingAttempt);

export default router;
