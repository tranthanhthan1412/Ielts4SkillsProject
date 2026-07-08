import dotenv from "dotenv";
import fs from "fs/promises";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../src/libs/db.js";
import ReadingTest, {
  READING_QUESTION_TYPES,
} from "../src/models/ReadingTest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const supportedTypes = new Set(READING_QUESTION_TYPES);

dotenv.config({ path: path.join(backendRoot, ".env") });

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertText(value, fieldName) {
  assert(typeof value === "string" && value.trim(), `${fieldName} is required`);
}

function assertPositiveNumber(value, fieldName) {
  assert(
    typeof value === "number" && Number.isFinite(value) && value > 0,
    `${fieldName} must be a positive number`,
  );
}

function normalizeAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.map((item) =>
      typeof item === "string" ? item.trim() : item,
    );
  }

  return typeof answer === "string" ? answer.trim() : answer;
}

function hasAnswer(answer) {
  const normalized = normalizeAnswer(answer);

  if (Array.isArray(normalized)) {
    return normalized.length > 0;
  }

  return normalized !== undefined && normalized !== null && normalized !== "";
}

function validateOptions(options, fieldName) {
  if (options === undefined) {
    return;
  }

  assert(Array.isArray(options), `${fieldName} must be an array`);

  options.forEach((option, optionIndex) => {
    assertText(option.key, `${fieldName}[${optionIndex}].key`);
    assertText(option.text, `${fieldName}[${optionIndex}].text`);
  });
}

function validateReadingTest(test, sourceName) {
  assertText(test.slug, `${sourceName}: slug`);
  assertText(test.title, `${sourceName}: title`);
  assertText(test.description, `${sourceName}: description`);
  assertPositiveNumber(
    test.durationMinutes,
    `${sourceName}: durationMinutes`,
  );
  assert(
    ["draft", "published"].includes(test.status ?? "draft"),
    `${sourceName}: status must be draft or published`,
  );
  assert(
    ["easy", "medium", "hard"].includes(test.level ?? "medium"),
    `${sourceName}: level must be easy, medium, or hard`,
  );
  assert(
    Array.isArray(test.passages) && test.passages.length > 0,
    `${sourceName}: passages must contain at least one passage`,
  );

  const questionNumbers = new Set();

  test.passages.forEach((passage, passageIndex) => {
    const passagePath = `${sourceName}: passages[${passageIndex}]`;

    assertPositiveNumber(passage.order, `${passagePath}.order`);
    assertText(passage.title, `${passagePath}.title`);
    assertText(passage.content, `${passagePath}.content`);
    assert(
      Array.isArray(passage.questionGroups) &&
        passage.questionGroups.length > 0,
      `${passagePath}.questionGroups must contain at least one group`,
    );

    passage.questionGroups.forEach((group, groupIndex) => {
      const groupPath = `${passagePath}.questionGroups[${groupIndex}]`;

      assert(
        supportedTypes.has(group.type),
        `${groupPath}.type is not supported: ${group.type}`,
      );
      assertText(group.instruction, `${groupPath}.instruction`);
      validateOptions(group.options, `${groupPath}.options`);
      assert(
        Array.isArray(group.questions) && group.questions.length > 0,
        `${groupPath}.questions must contain at least one question`,
      );

      group.questions.forEach((question, questionIndex) => {
        const questionPath = `${groupPath}.questions[${questionIndex}]`;

        assertPositiveNumber(question.number, `${questionPath}.number`);
        assert(
          !questionNumbers.has(question.number),
          `${questionPath}.number is duplicated`,
        );
        questionNumbers.add(question.number);
        validateOptions(question.options, `${questionPath}.options`);
        assert(hasAnswer(question.answer), `${questionPath}.answer is required`);
      });
    });
  });
}

async function findJsonFiles(inputPath) {
  const stat = await fs.stat(inputPath);

  if (stat.isFile()) {
    assert(
      inputPath.endsWith(".json"),
      `${inputPath} must be a JSON file or a directory containing JSON files`,
    );
    return [inputPath];
  }

  const entries = await fs.readdir(inputPath);

  return entries
    .filter((entry) => entry.endsWith(".json"))
    .sort()
    .map((entry) => path.join(inputPath, entry));
}

async function readReadingTest(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const test = JSON.parse(raw);

  validateReadingTest(test, path.basename(filePath));

  return {
    ...test,
    slug: test.slug.trim().toLowerCase(),
    status: test.status ?? "draft",
    level: test.level ?? "medium",
    passages: test.passages.map((passage) => ({
      ...passage,
      questionGroups: passage.questionGroups.map((group) => ({
        ...group,
        questions: group.questions.map((question) => ({
          ...question,
          answer: normalizeAnswer(question.answer),
        })),
      })),
    })),
  };
}

async function importReadingTests() {
  const requestedPath = process.argv[2]
    ? path.resolve(backendRoot, process.argv[2])
    : path.join(backendRoot, "seeds", "reading");
  const files = await findJsonFiles(requestedPath);

  assert(files.length > 0, `No JSON files found in ${requestedPath}`);

  const slugs = new Set();
  const tests = [];

  for (const filePath of files) {
    const test = await readReadingTest(filePath);

    assert(!slugs.has(test.slug), `${test.slug} is duplicated in seed files`);
    slugs.add(test.slug);
    tests.push(test);
  }

  await connectDB();

  let importedCount = 0;

  for (const test of tests) {
    const result = await ReadingTest.updateOne(
      { slug: test.slug },
      { $set: test },
      { runValidators: true, upsert: true },
    );
    const action = result.upsertedCount > 0 ? "created" : "updated";

    importedCount += 1;
    console.log(`${action}: ${test.slug}`);
  }

  console.log(`Imported ${importedCount} reading test(s).`);
}

importReadingTests()
  .catch((error) => {
    console.error("Failed to import reading tests:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
