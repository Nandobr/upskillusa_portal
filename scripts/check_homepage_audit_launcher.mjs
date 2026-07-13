import assert from "node:assert/strict";
import fs from "node:fs";
import {
  clearLegacyHomepageAuditStorage,
  createHomepageImplementDraft,
  isValidHomepageCompanyUrl,
  legacyHomepageAuditCleanupScript,
  legacyHomepageAuditStorageKeys,
} from "../src/lib/homepage-audit-launcher.ts";

assert.equal(isValidHomepageCompanyUrl("example.com"), true);
assert.equal(isValidHomepageCompanyUrl(" https://www.example.com/path "), true);
assert.equal(isValidHomepageCompanyUrl("http://subdomain.example.co.uk"), true);
for (const value of ["", "example", "https://", "javascript:alert(1)", "https://bad host.com", "https://user:pass@example.com"]) {
  assert.equal(isValidHomepageCompanyUrl(value), false, `${value || "empty input"} should be invalid`);
}

const staleImplement = {
  audience: "employee",
  companyUrl: "old.example",
  email: "person@example.com",
  workflowName: "stale workflow",
  pilotScope: "stale scope",
  humanGate: "stale gate",
  workArea: "Operations",
  report: { kind: "business", stale: true },
  selectedPilot: { id: "stale" },
  savedAt: "2025-01-01",
  selectedTasks: ["stale task"],
  customTasks: ["stale custom task"],
  impactsPeople: true,
  usesSensitiveData: true,
  harmIfWrong: true,
  needsExplanation: true,
  hasAppealPath: false,
};
const implementDefaults = {
  ...staleImplement,
  companyUrl: "",
  email: "",
  workflowName: "",
  pilotScope: "",
  humanGate: "",
  workArea: undefined,
  audience: undefined,
  report: undefined,
  selectedPilot: undefined,
  savedAt: undefined,
  selectedTasks: [],
  customTasks: [],
  impactsPeople: false,
  usesSensitiveData: false,
  harmIfWrong: false,
  needsExplanation: false,
  hasAppealPath: true,
};
const nextImplement = createHomepageImplementDraft(implementDefaults, "  example.com  ");
assert.deepEqual(nextImplement, {
  ...implementDefaults,
  audience: "business",
  companyUrl: "example.com",
  email: "",
});

const originalDraft = {
  inspire: { marker: "inspire" },
  learn: { marker: "learn" },
  adapt: { marker: "adapt" },
  implement: staleImplement,
};
const stagedDraft = { ...originalDraft, implement: nextImplement };
assert.strictEqual(stagedDraft.inspire, originalDraft.inspire);
assert.strictEqual(stagedDraft.learn, originalDraft.learn);
assert.strictEqual(stagedDraft.adapt, originalDraft.adapt);
assert.notStrictEqual(stagedDraft.implement, originalDraft.implement);

const removed = [];
clearLegacyHomepageAuditStorage({ removeItem: (key) => removed.push(key) });
assert.deepEqual(removed, [...legacyHomepageAuditStorageKeys]);
clearLegacyHomepageAuditStorage({ removeItem: (key) => removed.push(key) });
assert.deepEqual(removed, [...legacyHomepageAuditStorageKeys, ...legacyHomepageAuditStorageKeys]);
assert.doesNotThrow(() => clearLegacyHomepageAuditStorage({ removeItem: () => { throw new Error("denied"); } }));
assert(legacyHomepageAuditCleanupScript.includes("window.localStorage.removeItem"));
for (const key of legacyHomepageAuditStorageKeys) {
  assert(legacyHomepageAuditCleanupScript.includes(key));
}

const portalPages = fs.readFileSync("src/components/portal-pages.tsx", "utf8");
const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
const overviewStart = portalPages.indexOf("export function OverviewPage()");
const overviewEnd = portalPages.indexOf("function PageHero", overviewStart);
const overviewSource = portalPages.slice(overviewStart, overviewEnd);
assert(overviewSource.includes("updateImplement(createHomepageImplementDraft(defaultDraft.implement, trimmedUrl))"));
assert(overviewSource.includes('router.push("/implement")'));
assert(!overviewSource.includes("fetch("), "homepage must not request the audit API");
assert(!portalPages.includes("HomepageAuditSection"), "legacy homepage audit section should be removed");
assert(!portalPages.includes("HomepageAuditReport"), "legacy homepage report should be removed");
assert(rootLayout.includes("legacyHomepageAuditCleanupScript"), "app must remove legacy homepage data before hydration");

console.log("Homepage audit launcher checks passed.");
