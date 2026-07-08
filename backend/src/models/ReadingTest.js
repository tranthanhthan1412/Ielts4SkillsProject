import mongoose from "mongoose";

export const READING_QUESTION_TYPES = [
  "multiple-choice",
  "true-false-not-given",
  "yes-no-not-given",
  "matching-headings",
  "matching-information",
  "sentence-completion",
  "summary-completion",
  "short-answer",
];

const optionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const readingQuestionSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      min: 1,
    },
    text: {
      type: String,
      trim: true,
    },
    paragraph: {
      type: String,
      trim: true,
    },
    options: {
      type: [optionSchema],
      default: undefined,
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    acceptedAnswers: {
      type: [String],
      default: undefined,
    },
    explanation: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const readingQuestionGroupSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: READING_QUESTION_TYPES,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      default: undefined,
    },
    questions: {
      type: [readingQuestionSchema],
      required: true,
      validate: {
        validator(questions) {
          return Array.isArray(questions) && questions.length > 0;
        },
        message: "A question group must contain at least one question",
      },
    },
  },
  { _id: false },
);

const readingPassageSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    questionGroups: {
      type: [readingQuestionGroupSchema],
      required: true,
      validate: {
        validator(groups) {
          return Array.isArray(groups) && groups.length > 0;
        },
        message: "A passage must contain at least one question group",
      },
    },
  },
  { _id: false },
);

const readingTestSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    passages: {
      type: [readingPassageSchema],
      required: true,
      validate: {
        validator(passages) {
          return Array.isArray(passages) && passages.length > 0;
        },
        message: "A reading test must contain at least one passage",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

readingTestSchema.virtual("questionCount").get(function questionCount() {
  return this.passages.reduce((total, passage) => {
    return (
      total +
      passage.questionGroups.reduce((groupTotal, group) => {
        return groupTotal + group.questions.length;
      }, 0)
    );
  }, 0);
});

export default mongoose.model("ReadingTest", readingTestSchema);
