import fs from "node:fs";

const catalogPath = new URL("../src/lib/data/ai-courses.ts", import.meta.url);
const source = fs.readFileSync(catalogPath, "utf8").toLowerCase();

const requiredTokens = [
  "chatgpt",
  "claude",
  "gemini",
  "google",
  "copilot",
  "microsoft",
  "educator",
  "business",
  "responsible",
];

const missing = requiredTokens.filter((token) => !source.includes(token));
const courseCount = (source.match(/\"title\":/g) ?? []).length;

if (courseCount < 100) {
  console.error(`Expected at least 100 AI courses, found ${courseCount}.`);
  process.exit(1);
}

if (missing.length > 0) {
  console.error(`AI course catalog is missing expected coverage tokens: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`AI course catalog QA passed with ${courseCount} courses.`);
