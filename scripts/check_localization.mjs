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
  for (const key of [
    "employeePlanningAssumption:",
    "reportedEmployeeCount:",
    "conservativeEstimate:",
    "lowerBoundRange:",
    "publicInformationReason:",
    "sampleEstimateReason:",
    "sampleSource:",
    "companySizeUnavailable:",
    "notEstimated:",
    "source:",
    "confidence:",
    "observed:",
    "annualRecoverable:",
    "fteEquivalent:",
  ]) {
    assert(block.includes(key), `implementation-lab-copy.ts ${language} business report copy is missing ${key}`);
  }
}

assert(portalPages.includes("formatOptionalUsd"), "business reports must suppress unknown currency metrics");
assert(portalPages.includes("formatOptionalHours"), "business reports must suppress unknown hour metrics");
assert(portalPages.includes("formatOptionalNumber(report.fteEquivalent"), "copied business reports must suppress an unknown FTE value");
assert(portalPages.includes("copy.lowerBoundRange(estimate.declaredRange)"), "range disclosures must explain their lower-bound assumption");
assert(portalPages.includes('basis: report.isDemo && normalizedBasis !== "inactive" ? "demo"'), "sample reports must disclose a sample assumption");
assert(portalPages.includes("Company size unavailable") === false, "unknown company-size copy should come from localization");

const homepageLauncherCopy = {
  en: {
    label: "Company URL",
    placeholder: "yourcompany.com",
    validation: "Enter a valid company URL.",
    cta: "Get your free AI Opportunity Report",
    demo: "Watch Demo",
  },
  es: {
    label: "URL de la empresa",
    placeholder: "tuempresa.com",
    validation: "Ingresa una URL de empresa válida.",
    cta: "Obtén gratis tu reporte de oportunidad con IA",
    demo: "Ver demo",
  },
  pt: {
    label: "URL da empresa",
    placeholder: "suaempresa.com",
    validation: "Insira uma URL válida da empresa.",
    cta: "Obtenha gratuitamente seu relatório de oportunidade com IA",
    demo: "Ver demo",
  },
};

for (const [language, copy] of Object.entries(homepageLauncherCopy)) {
  const block = extractLanguageBlock(content, language);
  assert(block.includes("launcher:"), `content.ts ${language} overview is missing launcher copy`);
  for (const [key, value] of Object.entries(copy)) {
    assert(block.includes(value), `content.ts ${language} launcher is missing ${key}: ${value}`);
  }
}

const firstFrameworkNames = {
  en: "Imagine",
  es: "Imaginar",
  pt: "Imaginar",
};

assert(content.includes('inspire: "/inspire"'), "content.ts must keep the inspire route at /inspire");
for (const [language, name] of Object.entries(firstFrameworkNames)) {
  const block = extractLanguageBlock(content, language);
  assert(
    block.includes(`{ key: "inspire", label: "${name}", href: sharedRoutes.inspire }`),
    `content.ts ${language} navigation must name the first framework ${name} and link to /inspire`,
  );
  assert(
    block.includes(`tagline: "${name} ->`),
    `content.ts ${language} brand tagline must start with ${name}`,
  );
  assert(
    block.includes(`title: "${name}"`),
    `content.ts ${language} first framework title must be ${name}`,
  );
  assert(
    block.includes('route: "/inspire"'),
    `content.ts ${language} first framework route must remain /inspire`,
  );
}

const overviewPageStart = portalPages.indexOf("export function OverviewPage()");
const overviewPageEnd = portalPages.indexOf("function PageHero", overviewPageStart);
const overviewPageSource = portalPages.slice(overviewPageStart, overviewPageEnd);
assert(!overviewPageSource.includes("30-second audit"), "homepage must not contain the unsubstantiated timing claim");
assert(!overviewPageSource.includes("Enterprise-grade security"), "homepage must not contain the unsubstantiated security claim");

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
