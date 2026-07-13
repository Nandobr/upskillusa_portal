#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  createExactEmployeeEstimate,
  createInactiveEmployeeEstimate,
  createRangeEmployeeEstimate,
  createUnknownEmployeeEstimate,
} from "../src/lib/audit-employee-estimate.ts";
import {
  computeCostModel,
  employeeEstimateDisclosure,
  mapAuditToBusinessReport,
  renderEmailHtml,
} from "../src/lib/business-audit-services.ts";

const painCategories = [
  { department: "Operations", symptom: "Manual order reconciliation" },
  { department: "Finance", symptom: "Repeated invoice entry" },
];

const estimates = {
  exact: createExactEmployeeEstimate(42, {
    provider: "the-companies-api",
    observedAt: "2026-07-12T12:00:00.000Z",
  }),
  range: createRangeEmployeeEstimate("51-200", {
    provider: "the-companies-api",
    observedAt: "2026-07-12T12:00:00.000Z",
  }, { requireEmployeeContext: false }),
  firecrawl: createRangeEmployeeEstimate("Company size: 51-200 employees", {
    provider: "firecrawl",
    domainMatch: "matched",
    evidenceUrl: "https://www.linkedin.com/company/example",
    evidenceExcerpt: "Company size: 51-200 employees. example.com",
    observedAt: "2026-07-12T12:00:00.000Z",
  }),
  inactive: createInactiveEmployeeEstimate({ provider: "the-companies-api" }),
  unknown: createUnknownEmployeeEstimate("no-match", { provider: "firecrawl" }),
};

for (const [name, estimate] of Object.entries(estimates)) {
  assert.ok(estimate, `${name} fixture should be valid`);
  const costModel = computeCostModel(
    { about: { industry: "retail" } },
    painCategories,
    estimate,
  );
  const report = mapAuditToBusinessReport({
    company_name: "Example Company",
    industry: "Retail",
    size_estimate: "Generated labels must not win",
    autonomous_workforce_score: 55,
    score_rationale: "Deterministic fixture.",
    executive_summary: "Deterministic fixture. No network calls are made.",
    pain_categories: painCategories,
    cost_model: costModel,
  }, "example.com", "leader@example.com");

  const roundTrip = JSON.parse(JSON.stringify(report));
  assert.deepEqual(roundTrip, report, `${name} report should survive JSON persistence`);
  assert.equal(report.employeeEstimate.status, estimate.status, `${name} status should map unchanged`);
  assert.equal(report.employees, estimate.value, `${name} planning assumption should map unchanged`);

  if (estimate.status === "known") {
    assert.ok(report.annualValueAtRisk > 0, `${name} should calculate employee-derived metrics`);
    assert.notEqual(report.sizeEstimate, "Generated labels must not win", `${name} should use normalized evidence`);
  } else if (estimate.status === "inactive") {
    assert.equal(report.annualValueAtRisk, 0, "inactive should preserve the existing zero state");
    assert.equal(report.addressableRoles, 0);
  } else {
    assert.equal(report.annualValueAtRisk, null, "unknown should suppress employee-derived metrics");
    assert.equal(report.addressableRoles, null);
    assert.equal(report.opportunities[0].estimatedAnnualHours, null);
  }

  for (const language of ["en", "es", "pt"]) {
    const html = renderEmailHtml(report, "example.com", language);
    assert.ok(html.includes(employeeEstimateDisclosure(estimate, language)), `${name}/${language} email should disclose the same estimate`);
    assert.ok(!html.includes("$0") || estimate.status === "inactive", `${name}/${language} should not format unknown values as zero`);
  }
}

assert.equal(estimates.range.value, 51);
assert.equal(estimates.firecrawl.value, 51);
assert.equal(estimates.firecrawl.provider, "firecrawl");
assert.equal(estimates.firecrawl.confidence, "medium");

console.log("Audit employee report checks passed.");
