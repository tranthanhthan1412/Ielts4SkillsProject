import mongoose from "mongoose";

const readingAttemptAnswerSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const readingAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    readingTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReadingTest",
      required: true,
      index: true,
    },
    testSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    testTitle: {
      type: String,
      required: true,
      trim: true,
    },
    answers: {
      type: [readingAttemptAnswerSchema],
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0,
    },
    questionCount: {
      type: Number,
      required: true,
      min: 1,
    },
    bandScore: {
      type: Number,
      required: true,
      min: 0,
      max: 9,
    },
    timeSpentSeconds: {
      type: Number,
      min: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ReadingAttempt", readingAttemptSchema);
