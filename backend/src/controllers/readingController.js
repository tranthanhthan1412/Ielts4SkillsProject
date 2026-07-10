import mongoose from "mongoose";
import ReadingTest from "../models/ReadingTest.js";
import ReadingAttempt from "../models/ReadingAttempt.js";

function countQuestions(passages = []) {
  return passages.reduce((total, passage) => {
    return (
      total +
      passage.questionGroups.reduce((groupTotal, group) => {
        return groupTotal + group.questions.length;
      }, 0)
    );
  }, 0);
}

function toReadingSummary(test) {
  return {
    id: test.slug,
    slug: test.slug,
    title: test.title,
    description: test.description,
    durationMinutes: test.durationMinutes,
    level: test.level,
    questionCount: countQuestions(test.passages),
  };
}

function sanitizeQuestion(question) {
  const { acceptedAnswers, answer, explanation, ...safeQuestion } = question;

  return safeQuestion;
}

function sanitizeReadingTest(test) {
  return {
    ...toReadingSummary(test),
    passages: test.passages.map((passage) => ({
      order: passage.order,
      title: passage.title,
      content: passage.content,
      questionGroups: passage.questionGroups.map((group) => ({
        type: group.type,
        instruction: group.instruction,
        options: group.options,
        questions: group.questions.map(sanitizeQuestion),
      })),
    })),
  };
}

function calculateBandScore(correctAnswers, totalQuestions) {
  const rawScoreBands = [
    { min: 39, band: 9 },
    { min: 37, band: 8.5 },
    { min: 35, band: 8 },
    { min: 32, band: 7.5 },
    { min: 30, band: 7 },
    { min: 26, band: 6.5 },
    { min: 23, band: 6 },
    { min: 18, band: 5.5 },
    { min: 16, band: 5 },
    { min: 13, band: 4.5 },
    { min: 10, band: 4 },
    { min: 8, band: 3.5 },
    { min: 6, band: 3 },
    { min: 4, band: 2.5 },
    { min: 2, band: 2 },
    { min: 1, band: 1 },
  ];
  const normalizedScore = Math.round((correctAnswers / totalQuestions) * 40);

  return rawScoreBands.find(({ min }) => normalizedScore >= min)?.band ?? 0;
}

function normalizeAnswer(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeAnswer);
  }

  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isEmptyAnswer(value) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(isEmptyAnswer);
  }

  return normalizeAnswer(value) === "";
}

function answersMatch(userAnswer, correctAnswer) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);

  if (Array.isArray(normalizedCorrectAnswer)) {
    return (
      Array.isArray(normalizedUserAnswer) &&
      normalizedCorrectAnswer.length === normalizedUserAnswer.length &&
      normalizedCorrectAnswer.every((answerPart, index) => {
        return answerPart === normalizedUserAnswer[index];
      })
    );
  }

  return normalizedUserAnswer === normalizedCorrectAnswer;
}

function isCorrectAnswer(userAnswer, question) {
  if (isEmptyAnswer(userAnswer)) {
    return false;
  }

  if (question.acceptedAnswers?.length) {
    return question.acceptedAnswers.some((acceptedAnswer) => {
      return answersMatch(userAnswer, acceptedAnswer);
    });
  }

  return answersMatch(userAnswer, question.answer);
}

function getQuestionAnswer(question) {
  return question.acceptedAnswers?.length ? question.acceptedAnswers : question.answer;
}

function flattenQuestions(test) {
  return test.passages.flatMap((passage) => {
    return passage.questionGroups.flatMap((group) => group.questions);
  });
}

function buildExplanationMap(test) {
  const map = {};

  for (const passage of test.passages) {
    for (const group of passage.questionGroups) {
      for (const question of group.questions) {
        if (question.explanation) {
          map[question.number] = question.explanation;
        }
      }
    }
  }

  return map;
}

function toAttemptResponse(attempt, explanationMap = {}) {
  return {
    id: attempt._id,
    testSlug: attempt.testSlug,
    testTitle: attempt.testTitle,
    correctAnswers: attempt.correctAnswers,
    questionCount: attempt.questionCount,
    bandScore: attempt.bandScore,
    timeSpentSeconds: attempt.timeSpentSeconds,
    submittedAt: attempt.submittedAt,
    answers: attempt.answers.map((answer) => ({
      number: answer.number,
      value: answer.value,
      correctAnswer: answer.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: explanationMap[answer.number] || null,
    })),
  };
}

function toAttemptSummary(attempt) {
  return {
    id: attempt._id,
    testSlug: attempt.testSlug,
    testTitle: attempt.testTitle,
    correctAnswers: attempt.correctAnswers,
    questionCount: attempt.questionCount,
    bandScore: attempt.bandScore,
    timeSpentSeconds: attempt.timeSpentSeconds,
    submittedAt: attempt.submittedAt,
  };
}

export const listReadingTests = async (_req, res) => {
  try {
    const tests = await ReadingTest.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ tests: tests.map(toReadingSummary) });
  } catch (error) {
    console.error("Error listing reading tests:", error);
    return res.status(500).json({ message: "Failed to load reading tests" });
  }
};

export const submitReadingAttempt = async (req, res) => {
  try {
    const slug = req.params.slug?.trim().toLowerCase();
    const test = await ReadingTest.findOne({
      slug,
      status: "published",
    });

    if (!test) {
      return res.status(404).json({ message: "Reading test not found" });
    }

    const submittedAnswers = Array.isArray(req.body.answers)
      ? req.body.answers
      : [];

    if (submittedAnswers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const answerMap = new Map(
      submittedAnswers.map((answer) => [Number(answer.number), answer.value]),
    );
    const questions = flattenQuestions(test);
    const gradedAnswers = questions.map((question) => {
      const value = answerMap.get(question.number) ?? "";
      const isCorrect = isCorrectAnswer(value, question);

      return {
        number: question.number,
        value,
        correctAnswer: getQuestionAnswer(question),
        isCorrect,
      };
    });
    const correctAnswers = gradedAnswers.filter(({ isCorrect }) => isCorrect)
      .length;
    const questionCount = questions.length;
    const timeSpentSeconds =
      typeof req.body.timeSpentSeconds === "number" &&
      Number.isFinite(req.body.timeSpentSeconds)
        ? Math.max(0, Math.round(req.body.timeSpentSeconds))
        : undefined;

    const attempt = await ReadingAttempt.create({
      userId: req.user._id,
      readingTestId: test._id,
      testSlug: test.slug,
      testTitle: test.title,
      answers: gradedAnswers,
      correctAnswers,
      questionCount,
      bandScore: calculateBandScore(correctAnswers, questionCount),
      timeSpentSeconds,
    });

    const explanationMap = buildExplanationMap(test);

    return res.status(201).json({ attempt: toAttemptResponse(attempt, explanationMap) });
  } catch (error) {
    console.error("Error submitting reading attempt:", error);
    return res.status(500).json({ message: "Failed to submit reading attempt" });
  }
};

export const getReadingAttempt = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.attemptId)) {
      return res.status(404).json({ message: "Reading attempt not found" });
    }

    const attempt = await ReadingAttempt.findOne({
      _id: req.params.attemptId,
      userId: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({ message: "Reading attempt not found" });
    }

    const test = await ReadingTest.findById(attempt.readingTestId).lean();
    const explanationMap = test ? buildExplanationMap(test) : {};

    return res.status(200).json({ attempt: toAttemptResponse(attempt, explanationMap) });
  } catch (error) {
    console.error("Error loading reading attempt:", error);
    return res.status(500).json({ message: "Failed to load reading attempt" });
  }
};

export const getReadingTest = async (req, res) => {
  try {
    const slug = req.params.slug?.trim().toLowerCase();
    const test = await ReadingTest.findOne({
      slug,
      status: "published",
    }).lean();

    if (!test) {
      return res.status(404).json({ message: "Reading test not found" });
    }

    return res.status(200).json({ test: sanitizeReadingTest(test) });
  } catch (error) {
    console.error("Error loading reading test:", error);
    return res.status(500).json({ message: "Failed to load reading test" });
  }
};

export const listUserAttempts = async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

    const attempts = await ReadingAttempt.find({ userId: req.user._id })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ attempts: attempts.map(toAttemptSummary) });
  } catch (error) {
    console.error("Error listing user attempts:", error);
    return res.status(500).json({ message: "Failed to load attempt history" });
  }
};
