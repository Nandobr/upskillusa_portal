import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function extractObjectBlock(source, marker) {
  const start = source.indexOf(marker);
  if (start === -1) return "";
  const assignmentStart = source.indexOf("=", start);
  const braceStart = source.indexOf("{", assignmentStart === -1 ? start : assignmentStart);
  let depth = 0;

  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(braceStart, index + 1);
  }

  return "";
}

function extractLanguageBlock(source, language) {
  let depth = 0;
  let start = -1;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 1 && source.slice(index, index + language.length + 3) === `${language}: {`) {
      start = index;
      break;
    }
  }

  if (start === -1) return "";
  const braceStart = source.indexOf("{", start);
  depth = 0;

  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(braceStart, index + 1);
  }

  return "";
}

const content = read("src/lib/content.ts");
const plan = read("src/lib/plan.ts");
const portalPages = read("src/components/portal-pages.tsx");
const demoPage = read("src/components/demo-page-content.tsx");
const implementationCopy = read("src/lib/implementation-lab-copy.ts");
const businessAudit = read("src/lib/business-audit-services.ts");
const employeeRoute = read("src/app/api/analyze-employee-tasks/route.ts");
const businessRoute = read("src/app/api/analyze-business-opportunity/route.ts");

for (const language of ["en", "es", "pt"]) {
  assert(content.includes(`${language}: {`), `content.ts is missing ${language} copy`);
  assert(plan.includes(`${language}: {`), `plan.ts is missing ${language} copy`);
  assert(demoPage.includes(`${language}: {`), `demo-page-content.tsx is missing ${language} copy`);
  assert(implementationCopy.includes(`${language}: {`), `implementation-lab-copy.ts is missing ${language} copy`);
}

assert(content.includes("pt-BR"), "content.ts must document pt as pt-BR");
assert(portalPages.includes("language,"), "portal report API requests should include selected language");
assert(businessAudit.includes("languageInstruction"), "business Gemini prompt must include language instructions");
assert(employeeRoute.includes("reportLanguageName"), "employee Gemini prompt must include report language names");
assert(businessRoute.includes("parseLanguage"), "business report route must parse the requested language");

const implementationRequiredKeys = [
  "title:",
  "subtitle:",
  "resetConfirm:",
  "errors:",
  "audience:",
  "business:",
  "employee:",
  "loading:",
  "actions:",
  "businessReport:",
  "employeeReport:",
  "guardrails:",
];

for (const language of ["en", "es", "pt"]) {
  const block = extractLanguageBlock(implementationCopy, language);
  assert(block, `implementation-lab-copy.ts ${language} block could not be parsed`);
  for (const key of implementationRequiredKeys) {
    assert(block.includes(key), `implementation-lab-copy.ts ${language} block is missing ${key}`);
  }
}

const learnBlock = extractObjectBlock(plan, "const learnLocalization");
for (const language of ["en", "es", "pt"]) {
  const block = extractLanguageBlock(learnBlock, language);
  assert(block, `learnLocalization ${language} block could not be parsed`);
  for (const key of ["groups:", "goals:", "formats:", "tools:", "report:"]) {
    assert(block.includes(key), `learnLocalization ${language} block is missing ${key}`);
  }
}

const emptyCopyPattern = /\b(label|title|subtitle|description|eyebrow|intro|button|placeholder|message|body|text|error|saved|copied|generate|downloadPdf|printSavePdf)\s*:\s*""/g;
for (const [file, source] of [
  ["src/lib/content.ts", content],
  ["src/lib/plan.ts", plan],
  ["src/lib/implementation-lab-copy.ts", implementationCopy],
  ["src/components/demo-page-content.tsx", demoPage],
  ["src/components/portal-pages.tsx", portalPages],
]) {
  const matches = [...source.matchAll(emptyCopyPattern)];
  assert(matches.length === 0, `${file} has empty user-facing copy fields: ${matches.map((match) => match[0]).join(", ")}`);
}

const forbiddenMarkers = ["TODO_TRANSLATE", "MISSING_TRANSLATION", "__TRANSLATE__"];
for (const [file, source] of [
  ["src/lib/content.ts", content],
  ["src/lib/plan.ts", plan],
  ["src/lib/implementation-lab-copy.ts", implementationCopy],
  ["src/components/demo-page-content.tsx", demoPage],
  ["src/components/portal-pages.tsx", portalPages],
]) {
  for (const marker of forbiddenMarkers) {
    assert(!source.includes(marker), `${file} contains ${marker}`);
  }
}

if (failures.length > 0) {
  console.error("Localization QA failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Localization QA passed.");
